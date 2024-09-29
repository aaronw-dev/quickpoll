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
        let option = document.createElement('button')
        option.innerText = item.text
        pollOptions.appendChild(option)
        option.addEventListener("click", e => {
            socket.emit("vote", { "vote": i, "id": pollID })
        });
    }
}


var socket = io();
socket.on('connect', function () {
    doAll()
});