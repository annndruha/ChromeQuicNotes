document.addEventListener("DOMContentLoaded", () => {
    chrome.storage.sync.get(null, function (res) {

        for (let [key, value] of Object.entries(res)) {
            let note = document.createElement('span')
            note.id = key
            note.innerText = value
            note.className = 'note'

            let frame = document.getElementById('frame')
            frame.append(note)
            console.log(note)
        }
    })
})

document.addEventListener("click", function (e) {
    if (e.target.id === "delete_all") {
        chrome.storage.sync.clear()
        window.close()
    }
    if (e.target.className === "note")
        {
            navigator.clipboard.writeText(e.target.innerText)
        }
})