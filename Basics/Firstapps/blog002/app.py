import os
from datetime import datetime
from flask import Flask, render_template, redirect, url_for, request, flash, session, send_from_directory, abort
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
import markdown2

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
INSTANCE_DIR = os.path.join(BASE_DIR, "instance")
UPLOAD_DIR = os.path.join(INSTANCE_DIR, "uploads")
os.makedirs(INSTANCE_DIR, exist_ok=True)
os.makedirs(UPLOAD_DIR, exist_ok=True)

app = Flask(__name__, instance_relative_config=True)
app.config['SECRET_KEY'] = os.environ.get('FLASK_SECRET', 'replace-this-with-secure-key')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(INSTANCE_DIR, 'noir_blog.sqlite3')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = UPLOAD_DIR
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB per upload

db = SQLAlchemy(app)
login_manager = LoginManager(app)
login_manager.login_view = 'login'
login_manager.login_message = "You need to login to access that."

# --- Models -------------------------------------------------------
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)          # handle
    realname = db.Column(db.String(120))
    email = db.Column(db.String(200), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    age = db.Column(db.Integer)
    job = db.Column(db.String(150))
    bio = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    posts = db.relationship('Post', backref='author', lazy='dynamic')
    comments = db.relationship('Comment', backref='author', lazy='dynamic')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Topic(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    posts = db.relationship('Post', backref='topic', lazy='dynamic')

class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(250), nullable=False)
    body = db.Column(db.Text, nullable=False)   # markdown stored raw
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    topic_id = db.Column(db.Integer, db.ForeignKey('topic.id'), nullable=False)
    attachment_filename = db.Column(db.String(300), nullable=True)
    comments = db.relationship('Comment', backref='post', lazy='dynamic')

class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    body = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey('post.id'), nullable=False)

# --- Login loader ------------------------------------------------
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# --- Helpers -----------------------------------------------------
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in {
        'pdf','png','jpg','jpeg','gif','txt','md','doc','docx','ppt','pptx','xls','xlsx','csv', 'css', 'html', 'sh', 'js'
    }

def init_topics():
    default_topics = [
        "Ops & Intel","Signals","Cyber","Analysis","Tradecraft",
        "History","Weapons","Policy","Field Notes","General"
    ]
    for t in default_topics:
        if not Topic.query.filter_by(name=t).first():
            db.session.add(Topic(name=t))
    db.session.commit()

@app.before_request
def ensure_db():
    db.create_all()
    init_topics()

# --- Routes ------------------------------------------------------
@app.route('/')
def index():
    page = request.args.get('page', 1, type=int)
    posts = Post.query.order_by(Post.created_at.desc()).limit(20).all()
    topics = Topic.query.order_by(Topic.name).limit(10).all()
    return render_template('index.html', posts=posts, topics=topics)

@app.route('/topics')
def topics():
    topics = Topic.query.order_by(Topic.name).all()
    return render_template('topics.html', topics=topics)

@app.route('/topic/<int:topic_id>')
def topic_view(topic_id):
    topic = Topic.query.get_or_404(topic_id)
    posts = topic.posts.order_by(Post.created_at.desc()).all()
    return render_template('index.html', posts=posts, current_topic=topic)

@app.route('/post/new', methods=['GET', 'POST'])
@login_required
def post_new():
    topics = Topic.query.order_by(Topic.name).all()
    if request.method == 'POST':
        title = request.form.get('title','').strip()
        body = request.form.get('body','').strip()
        topic_id = request.form.get('topic_id', type=int)
        if not (title and body and topic_id):
            flash("Title, body and topic required.", "danger")
            return render_template('post_new.html', topics=topics)
        attachment = request.files.get('attachment')
        filename = None
        if attachment and attachment.filename:
            if not allowed_file(attachment.filename):
                flash("Attachment not allowed.", "danger")
                return render_template('post_new.html', topics=topics)
            filename = secure_filename(f"{datetime.utcnow().timestamp()}_{attachment.filename}")
            attachment.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        post = Post(title=title, body=body, user_id=current_user.id, topic_id=topic_id, attachment_filename=filename)
        db.session.add(post)
        db.session.commit()
        flash("Post created.", "success")
        return redirect(url_for('post_detail', post_id=post.id))
    return render_template('post_new.html', topics=topics)

@app.route('/post/<int:post_id>', methods=['GET'])
def post_detail(post_id):
    post = Post.query.get_or_404(post_id)
    # enforce anon read limit
    if not current_user.is_authenticated:
        anon_reads = session.get('anon_reads', 0)
        if anon_reads >= 5:
            flash("Guest read limit reached. Register or login to continue reading full posts.", "warning")
            return redirect(url_for('login', next=url_for('post_detail', post_id=post_id)))
        session['anon_reads'] = anon_reads + 1
    html = markdown2.markdown(post.body, extras=["fenced-code-blocks", "tables", "strike"])
    comments = post.comments.order_by(Comment.created_at.asc()).all()
    return render_template('post_detail.html', post=post, html_body=html, comments=comments)

@app.route('/post/<int:post_id>/download')
def post_download(post_id):
    post = Post.query.get_or_404(post_id)
    if not post.attachment_filename:
        flash("No attachment.", "danger")
        return redirect(url_for('post_detail', post_id=post_id))
    return send_from_directory(app.config['UPLOAD_FOLDER'], post.attachment_filename, as_attachment=True)

@app.route('/post/<int:post_id>/edit', methods=['GET','POST'])
@login_required
def post_edit(post_id):
    post = Post.query.get_or_404(post_id)
    if post.user_id != current_user.id:
        abort(403)
    topics = Topic.query.order_by(Topic.name).all()
    if request.method == 'POST':
        post.title = request.form.get('title','').strip()
        post.body = request.form.get('body','').strip()
        post.topic_id = request.form.get('topic_id', type=int)
        attachment = request.files.get('attachment')
        if attachment and attachment.filename:
            if allowed_file(attachment.filename):
                filename = secure_filename(f"{datetime.utcnow().timestamp()}_{attachment.filename}")
                attachment.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
                # remove old file if exists
                if post.attachment_filename:
                    try:
                        os.remove(os.path.join(app.config['UPLOAD_FOLDER'], post.attachment_filename))
                    except Exception:
                        pass
                post.attachment_filename = filename
            else:
                flash("Attachment not allowed.", "danger")
        db.session.commit()
        flash("Post updated.", "success")
        return redirect(url_for('post_detail', post_id=post.id))
    return render_template('post_new.html', post=post, topics=topics)

@app.route('/post/<int:post_id>/delete', methods=['POST'])
@login_required
def post_delete(post_id):
    post = Post.query.get_or_404(post_id)
    if post.user_id != current_user.id:
        abort(403)
    if post.attachment_filename:
        try:
            os.remove(os.path.join(app.config['UPLOAD_FOLDER'], post.attachment_filename))
        except Exception:
            pass
    db.session.delete(post)
    db.session.commit()
    flash("Post deleted.", "info")
    return redirect(url_for('index'))

@app.route('/post/<int:post_id>/comment', methods=['POST'])
@login_required
def post_comment(post_id):
    post = Post.query.get_or_404(post_id)
    body = request.form.get('comment','').strip()
    if not body:
        flash("Comment empty.", "danger")
        return redirect(url_for('post_detail', post_id=post_id))
    comment = Comment(body=body, user_id=current_user.id, post_id=post.id)
    db.session.add(comment)
    db.session.commit()
    flash("Comment added.", "success")
    return redirect(url_for('post_detail', post_id=post_id))

# --- Auth & profile ----------------------------------------------
@app.route('/register', methods=['GET','POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    if request.method == 'POST':
        username = request.form.get('username','').strip()
        realname = request.form.get('realname','').strip()
        email = request.form.get('email','').strip().lower()
        password = request.form.get('password','')
        age = request.form.get('age', type=int)
        job = request.form.get('job','').strip()
        bio = request.form.get('bio','').strip()
        if not (username and email and password):
            flash("Username, email and password required.", "danger")
            return render_template('auth_register.html')
        if User.query.filter_by(username=username).first():
            flash("Username taken.", "danger")
            return render_template('auth_register.html')
        if User.query.filter_by(email=email).first():
            flash("Email already registered.", "danger")
            return render_template('auth_register.html')
        u = User(username=username, realname=realname, email=email, age=age, job=job, bio=bio)
        u.set_password(password)
        db.session.add(u)
        db.session.commit()
        login_user(u)
        flash("Account created. Welcome aboard.", "success")
        return redirect(url_for('index'))
    return render_template('auth_register.html')

@app.route('/login', methods=['GET','POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    next_url = request.args.get('next') or url_for('index')
    if request.method == 'POST':
        credential = request.form.get('credential','').strip()
        password = request.form.get('password','')
        user = User.query.filter((User.username==credential)|(User.email==credential)).first()
        if user and user.check_password(password):
            login_user(user)
            flash("Logged in.", "success")
            return redirect(request.args.get('next') or url_for('index'))
        flash("Invalid credentials.", "danger")
    return render_template('auth_login.html', next=next_url)

@app.route('/logout')
@login_required
def logout():
    logout_user()
    flash("Logged out.", "info")
    return redirect(url_for('index'))

@app.route('/profile/<username>')
def profile(username):
    user = User.query.filter_by(username=username).first_or_404()
    posts = user.posts.order_by(Post.created_at.desc()).all()
    return render_template('profile.html', profile_user=user, posts=posts)

@app.route('/profile/<username>/edit', methods=['GET','POST'])
@login_required
def profile_edit(username):
    if current_user.username != username:
        abort(403)
    if request.method == 'POST':
        current_user.realname = request.form.get('realname','').strip()
        current_user.email = request.form.get('email','').strip().lower()
        current_user.age = request.form.get('age', type=int)
        current_user.job = request.form.get('job','').strip()
        current_user.bio = request.form.get('bio','').strip()
        pwd = request.form.get('password','')
        if pwd:
            current_user.set_password(pwd)
        db.session.commit()
        flash("Profile updated.", "success")
        return redirect(url_for('profile', username=current_user.username))
    return render_template('profile_edit.html', user=current_user)

@app.route('/account/delete', methods=['POST'])
@login_required
def account_delete():
    user = User.query.get_or_404(current_user.id)
    # delete user's posts and attachments
    for p in user.posts:
        if p.attachment_filename:
            try:
                os.remove(os.path.join(app.config['UPLOAD_FOLDER'], p.attachment_filename))
            except Exception:
                pass
    logout_user()
    # remove comments first
    Comment.query.filter_by(user_id=user.id).delete()
    Post.query.filter_by(user_id=user.id).delete()
    db.session.delete(user)
    db.session.commit()
    flash("Account and content removed.", "info")
    return redirect(url_for('index'))

# --- Simple search (title) ---------------------------------------
@app.route('/search')
def search():
    q = request.args.get('q','').strip()
    if not q:
        return redirect(url_for('index'))
    posts = Post.query.filter(Post.title.ilike(f"%{q}%")).order_by(Post.created_at.desc()).all()
    return render_template('index.html', posts=posts, q=q)

# --- small error handlers ----------------------------------------
@app.errorhandler(403)
def forbidden(e):
    return render_template('error.html', code=403, message="Forbidden"), 403

@app.errorhandler(404)
def not_found(e):
    return render_template('error.html', code=404, message="Not found"), 404

# --- Run ---------------------------------------------------------
if __name__ == '__main__':
    app.run(debug=True)
