// Listen for messages
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if (msg.command) {
    if (msg.command == "notify_arxiv_html") {
      const parser = new DOMParser();
      const doc = parser.parseFromString(msg.html, "text/html");
      const abst = doc.getElementById("abs");
      let comment = abst.querySelector(
        ".metatable tr:first-child td:nth-child(2)"
      );
      if (comment !== undefined) {
        comment = comment.textContent.replace(/\n/g, "").trim();
      } else {
        comment = "no comment";
      }

      let comment_msg =
        "<b style='color: darkgreen'>Comments: " + comment + "</b></br />";
      document
        .getElementsByClassName("entryBody")[0]
        .insertAdjacentHTML("beforebegin", comment_msg);
    }
  }
});
