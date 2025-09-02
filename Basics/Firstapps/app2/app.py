#!/bin/python3

from flask import Flask, render_template, redirect

app = Flask(__name__)

@app.route('/')
def root():
	return redirect("home")
@app.route('/home')
def home():
	return render_template("index.html")

@app.route('/contact')
def contact():
	return render_template("contact.html")

@app.route('/about')
def about():
	return render_template("about.html")

if __name__ == "__main__":
	app.run(debug=True)
