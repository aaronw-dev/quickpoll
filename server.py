import random, string
from flask_socketio import SocketIO, send, emit
from flask import Flask, request, render_template, jsonify

app = Flask(
    __name__, template_folder="pages", static_folder="files", static_url_path="/files"
)
socketio = SocketIO(app, ping_timeout=5000, ping_interval=10000)

activepolls = {}


def randomID(n):
    characters = string.ascii_letters + string.digits
    return "".join(random.choice(characters) for _ in range(n))


@app.route("/")
def main():
    return render_template("poll.html")


@app.route("/create")
def create():
    return render_template("create.html")


@app.route("/create/backend", methods=["POST"])
def createPoll():
    generatedid = randomID(8)
    activepolls[generatedid] = request.json
    for option in activepolls[generatedid]["options"]:
        option["votes"] = 0
    print(activepolls)
    return jsonify({"status": "ok", "poll_url": generatedid})


@app.route("/poll/<id>")
def poll(id):
    pi = activepolls[id]
    return render_template(
        "wantosend.html",
        name="QuickPoll",
        action="wants to ask",
        question=pi["title"],
    )


@app.route("/monitor/<id>")
def monitor(id):
    return render_template("monitor.html", title=activepolls[id]["title"])


@app.route("/pollinfo/<id>")
def pollinfo(id):
    return jsonify(activepolls[id])


@app.route("/poll/<id>/questions")
def pollquestions(id):
    return render_template("poll.html")


@app.route("/poll/<id>/done")
def done(id):
    return render_template("thankspoll.html")


@socketio.on("vote")
def vote(json):
    print(activepolls[json["id"]]["options"][json["vote"]])
    activepolls[json["id"]]["options"][json["vote"]]["votes"] += 1
    socketio.emit(
        "newvote",
        {
            "option": json["vote"],
            "votes": activepolls[json["id"]]["options"][json["vote"]]["votes"],
        },
        include_self=False,
    )
    return json


socketio.run(app, host="0.0.0.0", port=5000)
