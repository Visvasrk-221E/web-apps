#!/bin/python3

from flask import Flask, render_template, redirect, url_for

# Define the flask app
app = Flask(__name__)

# Create the root to redirect to home

@app.route('/')
def root():
	return redirect(url_for('home'))

# Define the home
@app.route('/home')
def home():
	return render_template('index.html')

@app.route('/is_admin/<username>')
def is_admin(username):
	admins = ["Visvasrk", "visvasrk", "visvasrk001", "Visvasrk001", "Visvasrk221e", "visvasrk221e", "Visvasrk-221E"]
	if username in admins:
		return f"<h1>Yes, {username} is an admin of Framework 221E</h1>"
	else:
		return f"<h1>No, {username} is not admin of this project</h1>"


# Define the about
@app.route('/about')
def about():
	return render_template('about.html')

# Define the contact page
@app.route('/contact')
def contact():
	return render_template('contact.html')

# Define the courses page
@app.route('/courses')
def courses():
	available_courses = ["flask_web_development"]
	return render_template('courses.html', courses=available_courses)

# Define the individual courses, show course page
@app.route('/courses/<course_name>')
def show_course(course_name):
	return redirect(url_for(course_name))

@app.route('/courses/flask_web_development')
def flask_web_development():
	available_modules=['module1']
	return render_template('flask_web_development/index.html', modules=available_modules)

@app.route('/courses/flask_web_development/<module_name>')
def show_flask_web_development_module(module_name):
	return redirect(url_for(module_name))

@app.route('/courses/flask_web_development/module1')
def fwd_module_1():
	return render_template('flask_web_development/module1.html')


if __name__ == "__main__":
	app.run(debug=True)
