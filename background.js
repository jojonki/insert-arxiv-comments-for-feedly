'use strict';

function retrieveCommentFromArxiv(arxiv_url) {
    $.ajax({     
        type: "GET",
        url: arxiv_url,
        success: function (data) {
            let $dom = $($.parseHTML(data));
            let comment = $dom.find('div.metatable').find('.comments').text();
            if (comment === null || comment === '') {
                comment = 'No comments';
            }
            let options = {
                type: "basic",
                iconUrl: "./images/icon_128.png",
                title: "Author Comments",
                message: "\"" + comment + "\"",
            }
            console.log("call notifications");
            chrome.notifications.create('copy_with_text_notification', options);
            // document.getElementById('msg').innerHTML = comment;
        }
    });
}
function modifyDOM() {
    return document.body.innerHTML;
}


chrome.tabs.onUpdated.addListener(
    function(tabId, changeInfo, tab) {
        // read changeInfo data and do something with it
        // like send the new url to contentscripts.js
        if ('url' in changeInfo) {
            console.log('ChangeURL:' + changeInfo.url);
            if (changeInfo.url.startsWith('https://feedly.com/i/entry')) {
                chrome.tabs.executeScript({
                    code: '(' + modifyDOM + ')();' //argument here is a string but function.toString() returns function's code
                }, (results) => {
                    let $dom = $($.parseHTML(results[0]));
                    let paper_url = $dom.find('div.entryHeader a').attr('href');
                    retrieveCommentFromArxiv(paper_url);

                });
            }
        }
    }
);

// chrome.commands.onCommand.addListener(function(command) {
//     console.log("onCommand:", command);
//     let copy_mode = null;
//     if (command === "copy-text-with-url-as-plain") {
//         copy_mode = "plain"
//     } else if (command === "copy-text-with-url-as-markdown") {
//         copy_mode = "markdown"
//     } else {
//         alert("Unknown command: " + command);
//     }
//
//     console.log("copy mode", copy_mode);
//     if (copy_mode !== undefined) {
//         console.log("call tabs.query to activeTab");
//         chrome.tabs.query({
//             active: true,
//             lastFocusedWindow: true
//         }, function(tabs) {
//             console.log("call copyTextWithURL");
//             copyTextWithURL(tabs[0], copy_mode);
//         });
//     }
// });
//
// // chrome.browserAction.onClicked.addListener(copyTextWithURL);
// chrome.browserAction.onClicked.addListener(pop);
