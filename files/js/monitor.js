const pollOptions = document.querySelector(".poll-options")
const titleElement = document.getElementById("poll-title")
const pollID = location.href.split("/")[4]
console.log(pollID)
async function doAll() {
    let pollInfo = {}
    await fetch(`/pollinfo/${pollID}`)
        .then(data => data.json())
        .then(json => pollInfo = json)
    console.log(pollInfo)
    titleElement.innerText = pollInfo.title
    for (let i = 0; i < pollInfo.options.length; i++) {
        item = pollInfo.options[i]
        let optionContainer = document.createElement("div")
        let optionEditable = document.createElement("div")
        optionEditable.innerText = item.text + " - " + item.votes + " votes"
        optionContainer.setAttribute("text", item.text)
        optionContainer.appendChild(optionEditable)
        pollOptions.appendChild(optionContainer)
    }
}


var socket = io();
socket.on('connect', function () {
    doAll()
});

socket.on("newvote", function (data) {
    pollOptions.children[data.option].innerText = pollOptions.children[data.option].getAttribute("text") + " - " + data.votes + " votes"
})