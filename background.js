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
            chrome.tabs.sendMessage(tab.id, {
                command: "notify_comment",
                comment: comment
            });
        }
    });
}

function modifyDOM() {
    return document.body.innerHTML;
}

// Listen events for url changes
chrome.tabs.onUpdated.addListener(
    function(tabId, changeInfo, tab) {
        if ('url' in changeInfo) {
            if (changeInfo.url.startsWith('https://feedly.com/i/entry')) {
                chrome.tabs.executeScript({
                    code: '(' + modifyDOM + ')();'
                }, (results) => {
                    let $dom = $($.parseHTML(results[0]));
                    let paper_url = $dom.find('div.entryHeader a').attr('href');
                    retrieveCommentFromArxiv(paper_url, tab);
                });
            }
        }
    }
);
