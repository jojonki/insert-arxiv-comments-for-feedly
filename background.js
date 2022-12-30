"use strict";

function retrieveArticleUrl() {
  let url = document.querySelector(".Article__title");
  if (url !== null) {
    url = url.href.replace("http", "https");
  }
  return url;
}

// Listen events for url changes
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if ("url" in changeInfo) {
    if (changeInfo.url.startsWith("https://feedly.com/i/entry")) {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabId },
          func: retrieveArticleUrl,
        },
        (results) => {
          if (results.length > 0) {
            const url = results[0].result;
            if (url !== null && url.startsWith("https://arxiv.org/")) {
              fetch(results[0].result)
                .then(function (res) {
                  return res.text();
                })
                .then(function (html) {
                  chrome.tabs.sendMessage(tabId, {
                    command: "notify_arxiv_html",
                    html: html,
                  });
                });
            } else {
              //   console.log("not arxiv article.");
            }
          }
        }
      );
    }
  }
});
