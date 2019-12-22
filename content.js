// // Listen for messages
// chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
//     // If the received message has the expected format...
//     // if (msg.text === 'report_back') {
//         // Call the specified callback, passing
//         // the web-page's DOM content as argument
//         sendResponse(document.all[0].outerHTML);
//     // }
// });
chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    if (msg.command && (msg.command == "notify_comment")) {
        // var src = document.getElementsByTagName("title")[0].innerHTML;
        // alert('##########received Response' + msg.comment);
        // var dst = msg.title;
        // alert(msg.comment);
        let comment_msg = "<b style='color: darkgreen'>Comments: " + msg.comment + "</b></br />";
        document.getElementsByClassName('fx metadata')[0].insertAdjacentHTML('afterbegin', comment_msg);
        // document.getElementsByTagName("title")[0].innerHTML = dst;
        // sendResponse("the page title's changed: '" + src + "' -> '" + dst + "'");
    }
});
