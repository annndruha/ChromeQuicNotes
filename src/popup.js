document.addEventListener("DOMContentLoaded", () => {
    chrome.storage.sync.get(null, function (res) {

        for (let [key, value] of Object.entries(res)) {
            let note = document.createElement('span')
            note.innerText = value
            note.className = 'note_text'

            let icon_copy = document.createElement('img')
            icon_copy.src = 'images/copy.svg'
            icon_copy.className = 'icon_copy'

            let note_group = document.createElement('div')
            note_group.className = 'half-left'
            note_group.appendChild(icon_copy)
            note_group.appendChild(note)

            let icon_delete = document.createElement('img')
            icon_delete.src = 'images/delete.svg'
            icon_delete.className = 'delete_note_button'

            let icons_group = document.createElement('div')
            icons_group.className = 'half-right'
            icons_group.appendChild(icon_delete)

            let note_container = document.createElement('div')
            note_container.id = key
            note_container.className = 'note'
            note_container.appendChild(note_group)
            note_container.appendChild(icons_group)

            let header = document.getElementById('header')
            header.appendChild(note_container)
        }
        addListener()
    })
})

function addListener() {
    $('.note').on('click', function (e) {
        e.stopPropagation()
        e.preventDefault()
        navigator.clipboard.writeText(e.target.innerText)
        window.close()
    })

    $('.delete_note_button').on('click', function (e) {
        e.stopPropagation()
        e.preventDefault()
        let key = e.target.parentElement.parentElement.id
        console.log('delete key: ', key)
        chrome.storage.sync.remove([key], () => {
            chrome.storage.sync.get(null, (res) => {
                console.log(res)
            })
        })
        document.getElementById(key).remove()
    })

    $('#delete_all').on('click', function (e) {
        e.stopPropagation()
        e.preventDefault()
        chrome.storage.sync.clear(() => {
        })
        let parent = document.getElementById("header")
        parent.innerText = ''
    })
}
