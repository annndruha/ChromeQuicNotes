document.addEventListener("DOMContentLoaded", () => {
    chrome.storage.sync.get(null,  (res) => {
        for (let [note_id, note] of Object.entries(res)) {
            let icon_copy = document.createElement('img')
            icon_copy.src = 'images/copy.svg'
            icon_copy.className = 'icon_copy'

            let note_text = document.createElement('span')
            note_text.innerText = note['label']
            note_text.className = 'note_text'

            let note_group = document.createElement('div')
            note_group.className = 'half-left'
            note_group.appendChild(icon_copy)
            note_group.appendChild(note_text)

            let icon_edit = document.createElement('img')
            icon_edit.src = 'images/edit.svg'
            icon_edit.className = 'edit_note_button'

            let icon_delete = document.createElement('img')
            icon_delete.src = 'images/delete.svg'
            icon_delete.className = 'delete_note_button'

            let icons_group = document.createElement('div')
            icons_group.className = 'half-right'
            icons_group.appendChild(icon_edit)
            icons_group.appendChild(icon_delete)

            let note_container = document.createElement('div')
            note_container.id = note_id
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
        navigator.clipboard.writeText(e.target.innerText).then(() => {})
        window.close()
    })

    $('.note').on('mouseenter', function (e) {
        e.stopPropagation()
        e.preventDefault()
        try {
            let note_text = document.getElementById(e.target.id).getElementsByClassName("note_text")[0]
            chrome.storage.sync.get(e.target.id,  (res) => {
                note_text.innerText = res[e.target.id]['value']
            })
        }
        catch (e) {if (!e instanceof TypeError) {console.log(e)}}

    }).on('mouseleave', function(e) {
        e.stopPropagation()
        e.preventDefault()
        try {
            let note_text = document.getElementById(e.target.id).getElementsByClassName("note_text")[0]
            chrome.storage.sync.get(e.target.id,  (res) => {
                note_text.innerText = res[e.target.id]['label']
            })
        }
        catch (e) {if (!e instanceof TypeError) {console.log(e)}}
    })

    $('.delete_note_button').on('click', function (e) {
        e.stopPropagation()
        e.preventDefault()
        let key = e.target.parentElement.parentElement.id
        chrome.storage.sync.remove([key], () => {console.log('Remove key: ', key)})
        document.getElementById(key).remove()
    })

    $('.edit_note_button').on('click', function (e) {
        e.stopPropagation()
        e.preventDefault()
        let key = e.target.parentElement.parentElement.id


        chrome.storage.sync.get([key], (note) => {
//            let note_span = document.getElementById(key).getElementsByClassName("note_text")
//            note_span.innerHTML = '<input type="text" name="input" value="Type here" />'
            note[key]['label'] = 'test'
//            chrome.storage.sync.set(note, (res) => {console.log('Update key=', key,' :', res)})
        })
    })

    $('#delete_all').on('click', function (e) {
        e.stopPropagation()
        e.preventDefault()
        chrome.storage.sync.clear(() => {console.log('Removed all keys.')})
        let parent = document.getElementById("header")
        parent.innerText = ''
    })
}
