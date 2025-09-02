#!/bin/python3

from flask import Flask

app = Flask(__name__)

@app.route('/')
def home():
	return "<h1>Home</h1><p>This is a home page</p>"

@app.route('/about')
def about():
	return "<h1>About</h1><p>This is a about page</p>"

@app.route('/contact')
def contact():
	return "<h1>Contact</h1><p>This is a contact page</p>"

if __name__ == "__main__":
	app.run(debug=True)
	
