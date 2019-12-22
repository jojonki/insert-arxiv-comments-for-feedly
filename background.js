'use strict';

function retrieveCommentFromArxiv(arxiv_url, tab) {
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
            chrome.tabs.sendMessage(tab.id, {
                command: "notify_comment",
                comment: comment
            });
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
                    // $dom.find('div.fx.metadata').append('<p>#############</p>');
                    // alert(paper_url);
                    // alert("--####" + $dom.find('div.entryHeader'));
                      // chrome.tabs.sendMessage(tab.id, {
                      //     command: "change_title",
                      //     title: "hoge"
                      // });
                    console.log($dom.find('div.entryHeader'));
                    retrieveCommentFromArxiv(paper_url, tab);
                });
            }
        }
    }
);
