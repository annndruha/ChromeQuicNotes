function split_value(value){
    return value.split("||||abs_rand_string||||", 2)
}

function join_value(comment, whattocopy){
    return comment + "||||abs_rand_string||||" + whattocopy
}

function reset_and_close_edit_form(){
    document.getElementById("edit_id").innerHTML = ''
    document.getElementById("new-comment").value = ''
    document.getElementById("new-value").value = ''
    window.edit_dialog.close()
}

function load_notes(){
    chrome.storage.sync.get(null,  (res) => {
        let header = document.getElementById('header')
        header.innerHTML = ''
        for (let [key, value] of Object.entries(res)) {
            const [comment, whattocopy] = split_value(value)
            const element = `<div id="${key}" class="note">
                <div class="half-left">
                    <img src="images/copy.svg" class="icon_copy"></img>
                    <span class="comment">${comment}</span>
                    <span class="note_text">${whattocopy}</span>
                </div>
                <div class="half-right">
                    <img src="images/edit.svg" class="edit_note_button"></img>
                    <img src="images/delete.svg" class="delete_note_button"></img>
                </div>
            </div>`
            header.innerHTML = header.innerHTML + element
        }
        addListener()
    })
}


function addListener() {
    $('.note').on('click', function (e) {
        e.stopPropagation()
        e.preventDefault()
        navigator.clipboard.writeText(e.target.innerText).then(() => {
            console.log('Copied to clickboard: ', e.target.innerText)
        })
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

    $('.edit_note_button').on('click', function (e) {
        e.stopPropagation()
        e.preventDefault()
        let key = e.target.parentElement.parentElement.id
        console.log('Open edit: ', key)
        window.edit_dialog.showModal()

        chrome.storage.sync.get([key], (res) => {
            const [comment, whattocopy] = split_value(res[key])
            document.getElementById("edit_id").innerHTML = key
            if (comment === "No comment"){
                document.getElementById("new-comment").value = ''
            }   
            else {
                document.getElementById("new-comment").value = comment
            }
            document.getElementById("new-value").value = whattocopy
        })
    })

    $('#edit_discard').on('click', function (e) {
        const key = document.getElementById("edit_id").innerHTML
        console.log('Discard edit: ', key)
        e.stopPropagation()
        e.preventDefault()
        reset_and_close_edit_form()
    })

    $('#edit_apply').on('click', function (e) {
        e.stopPropagation()
        e.preventDefault()
        const key = document.getElementById("edit_id").innerHTML
        const value = join_value(document.getElementById("new-comment").value, document.getElementById("new-value").value)

        console.log('Apply edit: ', key, value)

        let json = {}
        json[key] = value
        chrome.storage.sync.set(json, (res) => {
            console.log('Edit saved', res)
            reset_and_close_edit_form()
            load_notes()
        })
    })

    $('#delete_all').on('click', function (e) {
        e.stopPropagation()
        e.preventDefault()
        chrome.storage.sync.clear(() => {
            load_notes()
        })
    })
}

document.addEventListener("DOMContentLoaded", () => {
    load_notes()
})