#!/bin/python3

from flask import Flask, render_template, send_from_directory, redirect, url_for

app = Flask(__name__)

@app.route('/')
def root():
	return redirect("home")

@app.route('/home')
def home():
	return render_template("index.html")

@app.route('/about')
def about():
	return render_template("about.html")

@app.route('/contact')
def contact():
	return render_template("contact.html")

@app.route('/examples/<example_name>')
def show_example(example_name='examples'):
	return redirect(url_for(example_name))

@app.route('/examples')
def examples():
	examples_list = ["forloop1"]
	return render_template("examples.html", examples = examples_list)

@app.route('/examples/forloop1')
def forloop1():
	users = ["User 1", "User2", "Anonymous", "Guest"]
	return render_template("forloop1.html", users = users)

if __name__ == "__main__":
	app.run(debug=True)
