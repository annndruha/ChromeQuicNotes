document.addEventListener("DOMContentLoaded", () => {
    chrome.storage.sync.get(null, function (res) {

        for (let [key, value] of Object.entries(res)) {

            let note = document.createElement('span')
            note.id = key
            note.innerText = value
            note.className = 'note_text'

            let icon = document.createElement('img')
            icon.src='images/copy.svg'

            let note_container = document.createElement('div')
            note_container.className = 'item note'
            note_container.appendChild(note)
            note_container.appendChild(icon)

            let header = document.getElementById('header')
            header.appendChild(note_container)
            addListener()
        }
    })
})

function addListener() {
    $('.note').on('click', function (e) {
        e.stopPropagation()
        e.preventDefault()
        navigator.clipboard.writeText(e.target.innerText)
        window.close()
    })

    $('#delete_all').on('click', function (e) {
        e.stopPropagation()
        e.preventDefault()
        chrome.storage.sync.clear()
        window.close()
    })
}
