function getCurrentTabUrl(callback) {
    var queryInfo = {
        url: 'https://feedly.com/*',
        active: true,
        currentWindow: true
    };

    chrome.tabs.query(queryInfo, (tabs) => {
        if (tabs.length > 0) {
            var tab = tabs[0];
            var url = tab.url;
            console.assert(typeof url == 'string', 'tab.url should be a string');
            callback(url);
        } else {
            $('#result').text('not arXiv!');
        }
    });
}


function retrieveCommentFromArxiv(arxiv_url) {
    $.ajax({     
        type: "GET",
        // url: 'https://arxiv.org/abs/1912.08981',
        url: arxiv_url,
        success: function (data) {
            let $dom = $($.parseHTML(data));
            let comment = $dom.find('div.metatable').find('.comments').text();
            if (comment === null || comment === '') {
                comment = 'No comments';
            }
            document.getElementById('msg').innerHTML = comment;
        }
    });
}

function modifyDOM() {
    return document.body.innerHTML;
}
document.addEventListener('DOMContentLoaded', () => {
    // getCurrentTabUrl((url) => {
        chrome.tabs.executeScript({
            code: '(' + modifyDOM + ')();' //argument here is a string but function.toString() returns function's code
        }, (results) => {
            alert(results);
            var $dom = $($.parseHTML(results[0]));
            let paper_url = $dom.find('div.entryHeader a').attr('href');
            retrieveCommentFromArxiv(paper_url);

            // hide popup automatically
            // setTimeout(function () {
            //   window.close();
            // }, 3000);
        });
    // });
});

