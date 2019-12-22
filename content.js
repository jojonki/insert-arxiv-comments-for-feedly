// Listen for messages
chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    if (msg.command) {
        if (msg.command == "notify_comment") {
            let comment_msg = "<b style='color: darkgreen'>Comments: " + msg.comment + "</b></br />";
            document.getElementsByClassName("fx metadata")[0].insertAdjacentHTML("afterbegin", comment_msg);
        }
    }
});
