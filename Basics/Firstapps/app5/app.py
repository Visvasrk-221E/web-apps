from flask import Flask, render_template, url_for, redirect
from datetime import datetime

app = Flask(__name__)

@app.route('/')
def redirect_to_home():
	return redirect(url_for('home'))

@app.route('/home')
def home():
	crt_time = datetime.now()
	return render_template('index.html', time=crt_time)

@app.route('/subjects/biology')
def biology():
	topics = {"biotechnology" : "This topic is about unit nine of grade 12 biology book. Both Biotechnology, Principles and Processes and its Applications are included.",

	}
	topic_count = len(topics)
	return render_template('biology/index.html', topics=topics, topic_count=topic_count)

@app.route('/subjects/biology/<topic>')
def biology_topic(topic):
	return redirect(url_for('topic'))

@app.route('/subjects/biology/biotechnology')
def biotechnology():
	return render_template('biology/biotechnology.html')


if __name__ == "__main__":
	app.run(host="0.0.0.0", port=5000, debug=True)


