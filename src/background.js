chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
            'id': '7Ed2x9MAFz3dgdJkBsuS3UrX',
            "title": 'Add to notes',
            'type': 'normal',
            'contexts': ['selection']
        }, () => {
        }
    )
})

chrome.contextMenus.onClicked.addListener(
    (info, tab) => {
        let idx = (new Date().getTime()).toString(36)
        let json = {}
        json[idx] = {'tab_idx': 0, order_idx: 0, 'label': info.selectionText, 'value': info.selectionText}
        chrome.storage.sync.set(json, (res) => {
            chrome.storage.sync.get([idx], (res) => {
                console.log('Item set:', res)
            })
        })
    }
)