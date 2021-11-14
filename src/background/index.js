import Api from "./api";

let headers = [];
chrome.webRequest.onSendHeaders.addListener(
  (details) => {
    const availableHeaders = [
      "x-guest-token",
      "x-csrf-token",
      "x-twitter-auth-type",
      "x-twitter-active-user",
      "authorization",
    ];
    const requestHeaders = details.requestHeaders.filter(
      (_) => availableHeaders.indexOf(_.name) > -1
    );
    if (requestHeaders.length >= headers.length) {
      headers = requestHeaders;
    }
  },
  { urls: ["*://twitter.com/i/api/*"], types: ["xmlhttprequest"] },
  ["requestHeaders"]
);
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getVideoUrl") {
    const api = new Api(headers);
    api
      .fetch(request.id)
      .then((response) => {
        sendResponse({
          status: true,
          url: response.url,
          name: response.name,
        });
      })
      .catch((error) => {
        sendResponse({
          status: false,
          message: error.message,
          length: headers.length,
        });
      });
    return true;
  }
});
chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === chrome.runtime.OnInstalledReason.INSTALL) {
    chrome.tabs.query({ url: "*://twitter.com/*" }).then((tabs) => {
      tabs.forEach((tab) => {
        chrome.tabs.reload(tab.id);
      });
    });
  }
});
