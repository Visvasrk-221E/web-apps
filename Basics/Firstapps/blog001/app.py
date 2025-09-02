import os
from datetime import datetime
from flask import Flask, render_template, redirect, url_for, flash, request, abort
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, TextAreaField, SubmitField, SelectField
from wtforms.validators import DataRequired, Length, Email, EqualTo, ValidationError
from werkzeug.security import generate_password_hash, check_password_hash

# ------------------------------
# App Factory
# ------------------------------
def create_app():
    app = Flask(__name__, instance_relative_config=True)

    # Secure defaults
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-noir8-change-me')
    os.makedirs(app.instance_path, exist_ok=True)
    db_path = os.path.join(app.instance_path, 'noir_blog.sqlite3')
    app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{db_path}"
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Blue/green-ready toggle for DEBUG via env
    app.config['DEBUG'] = os.environ.get('FLASK_DEBUG', '0') == '1'

    return app

app = create_app()
db  = SQLAlchemy(app)
login_manager = LoginManager(app)
login_manager.login_view = 'login'
login_manager.login_message_category = 'warning'

# ------------------------------
# Models
# ------------------------------
class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, index=True, nullable=False)
    email = db.Column(db.String(120), unique=True, index=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    posts = db.relationship('Post', backref='author', lazy='dynamic', cascade='all, delete-orphan')
    comments = db.relationship('Comment', backref='author', lazy='dynamic', cascade='all, delete-orphan')

    def set_password(self, raw):
        self.password_hash = generate_password_hash(raw)

    def check_password(self, raw):
        return check_password_hash(self.password_hash, raw)

class Topic(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), unique=True, nullable=False)
    slug = db.Column(db.String(64), unique=True, index=True, nullable=False)

    posts = db.relationship('Post', backref='topic', lazy='dynamic')

class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(160), nullable=False)
    body = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    topic_id = db.Column(db.Integer, db.ForeignKey('topic.id'), nullable=False)

    comments = db.relationship('Comment', backref='post', lazy='dynamic', cascade='all, delete-orphan')

class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    body = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey('post.id'), nullable=False)

# ------------------------------
# Login loader
# ------------------------------
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# ------------------------------
# Forms
# ------------------------------
class RegisterForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired(), Length(min=3, max=64)])
    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired(), Length(min=6)])
    confirm = PasswordField('Confirm', validators=[DataRequired(), EqualTo('password')])
    submit = SubmitField('Create Account')

    def validate_username(self, field):
        if User.query.filter_by(username=field.data).first():
            raise ValidationError("Username already taken.")

    def validate_email(self, field):
        if User.query.filter_by(email=field.data).first():
            raise ValidationError("Email already registered.")

class LoginForm(FlaskForm):
    username = StringField('Username or Email', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired()])
    submit = SubmitField('Sign In')

class PostForm(FlaskForm):
    title = StringField('Title', validators=[DataRequired(), Length(max=160)])
    topic = SelectField('Topic', coerce=int, validators=[DataRequired()])
    body  = TextAreaField('Body', validators=[DataRequired(), Length(min=10)])
    submit = SubmitField('Publish')

class CommentForm(FlaskForm):
    body = TextAreaField('Comment', validators=[DataRequired(), Length(min=2, max=5000)])
    submit = SubmitField('Comment')

# ------------------------------
# Utilities
# ------------------------------
def seed_default_topics():
    """Idempotent seed."""
    defaults = [
        ('General', 'general'),
        ('Security', 'security'),
        ('AI/ML', 'ai-ml'),
        ('OSINT', 'osint'),
        ('Engineering', 'engineering'),
    ]
    for name, slug in defaults:
        if not Topic.query.filter_by(slug=slug).first():
            db.session.add(Topic(name=name, slug=slug))
    db.session.commit()

# ------------------------------
# Routes
# ------------------------------
@app.route('/')
def index():
    q = request.args.get('q', '').strip()
    topic_slug = request.args.get('topic')
    page = max(int(request.args.get('page', 1)), 1)

    posts = Post.query.order_by(Post.created_at.desc())
    if topic_slug:
        t = Topic.query.filter_by(slug=topic_slug).first_or_404()
        posts = posts.filter_by(topic_id=t.id)
    if q:
        posts = posts.filter(Post.title.ilike(f'%{q}%') | Post.body.ilike(f'%{q}%'))

    posts = posts.paginate(page=page, per_page=10, error_out=False)
    topics = Topic.query.order_by(Topic.name.asc()).all()
    return render_template('index.html', posts=posts, topics=topics, active_topic=topic_slug, q=q)

@app.route('/topics')
def topics():
    topics = Topic.query.order_by(Topic.name.asc()).all()
    return render_template('topics.html', topics=topics)

@app.route('/t/<slug>')
def by_topic(slug):
    topic = Topic.query.filter_by(slug=slug).first_or_404()
    page = max(int(request.args.get('page', 1)), 1)
    posts = Post.query.filter_by(topic_id=topic.id).order_by(Post.created_at.desc()).paginate(page=page, per_page=10, error_out=False)
    topics = Topic.query.order_by(Topic.name.asc()).all()
    return render_template('index.html', posts=posts, topics=topics, active_topic=slug, q='')

@app.route('/post/<int:post_id>', methods=['GET', 'POST'])
def post_detail(post_id):
    post = Post.query.get_or_404(post_id)
    form = CommentForm()
    if form.validate_on_submit():
        if not current_user.is_authenticated:
            abort(403)
        c = Comment(body=form.body.data, author=current_user, post=post)
        db.session.add(c)
        db.session.commit()
        flash('Comment added.', 'success')
        return redirect(url_for('post_detail', post_id=post.id))

    # ✅ Prefetch comments here (fixed)
    comments = post.comments.order_by(Comment.created_at.desc()).all()
    return render_template('post_detail.html', post=post, form=form, comments=comments)

@app.route('/new', methods=['GET', 'POST'])
@login_required
def new_post():
    form = PostForm()
    form.topic.choices = [(t.id, t.name) for t in Topic.query.order_by(Topic.name.asc()).all()]
    if form.validate_on_submit():
        p = Post(title=form.title.data, body=form.body.data, topic_id=form.topic.data, author=current_user)
        db.session.add(p)
        db.session.commit()
        flash('Post published.', 'success')
        return redirect(url_for('post_detail', post_id=p.id))
    return render_template('post_new.html', form=form)

@app.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    form = RegisterForm()
    if form.validate_on_submit():
        u = User(username=form.username.data, email=form.email.data)
        u.set_password(form.password.data)
        db.session.add(u); db.session.commit()
        login_user(u)
        flash('Welcome aboard!', 'success')
        return redirect(url_for('index'))
    return render_template('auth_register.html', form=form)

@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    form = LoginForm()
    if form.validate_on_submit():
        identifier = form.username.data.strip()
        u = User.query.filter((User.username == identifier) | (User.email == identifier)).first()
        if u and u.check_password(form.password.data):
            login_user(u)
            flash('Signed in.', 'success')
            next_url = request.args.get('next')
            return redirect(next_url or url_for('index'))
        flash('Invalid credentials.', 'danger')
    return render_template('auth_login.html', form=form)

@app.route('/logout')
@login_required
def logout():
    logout_user()
    flash('Signed out.', 'success')
    return redirect(url_for('index'))

# ------------------------------
# CLI bootstrap
# ------------------------------
@app.cli.command('initdb')
def initdb():
    """Initialize the database and seed topics."""
    db.create_all()
    seed_default_topics()
    print("DB initialized. Topics seeded.")

# ------------------------------
# First-run guard
# ------------------------------
with app.app_context():
    if not os.path.exists(os.path.join(app.instance_path, 'noir_blog.sqlite3')):
        db.create_all()
        seed_default_topics()
app.run(debug=True)