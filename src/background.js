chrome.contextMenus.create({
        'id': '7Ed2x9MAFz3dgdJkBsuS3UrX',
        "title": 'Add node: %s',
        'type': 'normal',
        'contexts': ['selection']
    }, () => {}
)

chrome.contextMenus.onClicked.addListener(
    (info, tab) => {
        chrome.storage.sync.get(null, (res)=> {
            let idx = Object.keys(res).length + 1

            let json = {}
            json[idx] = info.selectionText
            console.log('json: ', json)
            chrome.storage.sync.set(json, (res)=> {
                console.log('json set', res)
            })
        })
    }
)