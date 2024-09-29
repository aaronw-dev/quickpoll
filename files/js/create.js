const pollOptions = document.querySelector(".poll-options")
const addOptionButton = document.querySelector("#addOption")
function addPollOption() {
    if (pollOptions.children.length < 5) {
        let optionContainer = document.createElement("div")
        let optionEditable = document.createElement("div")
        optionEditable.setAttribute("placeholder", "Option " + (pollOptions.children.length))
        optionEditable.contentEditable = true
        optionEditable.addEventListener("keypress", (e) => {
            if (e.code == "Enter") {
                e.preventDefault()
            }
        })
        optionContainer.appendChild(optionEditable)
        pollOptions.insertBefore(optionContainer, addOptionButton)
    }
    if (pollOptions.children.length >= 5) {
        addOptionButton.disabled = true
    }
}

for (let i = 0; i < 2; i++) {
    addPollOption()
}

function createPoll() {
    let dictionary = { "title": document.getElementById("poll-title").innerText, "options": [] }

    for (let i = 0; i < pollOptions.children.length - 1; i++) {
        console.log(pollOptions.children[i])
        dictionary["options"].push({
            "text": pollOptions.children[i].innerText
        })
    }
    console.log(dictionary)

    fetch("/create/backend", {
        method: 'POST',
        body: JSON.stringify(dictionary),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(response.status);
            }
            return response.json();
        })
        .then(data => {
            console.log('Success:', data);
        })
}