import Api from "./api";

const headers = {};
chrome.webRequest.onSendHeaders.addListener(
  (details) => {
    details.requestHeaders
      .filter((header) => {
        return (
          ["x-guest-token", "x-csrf-token", "authorization"].indexOf(
            header.name
          ) > -1
        );
      })
      .forEach((header) => {
        headers[header.name] = header.value;
      });
  },
  { urls: ["*://twitter.com/i/api/*"], types: ["xmlhttprequest"] },
  ["requestHeaders"]
);
const api = new Api();
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getVideoUrl") {
    api
      .fetch(request.id, headers)
      .then((response) => {
        sendResponse({
          status: true,
          url: response.url,
          name: response.name,
        });
      })
      .catch(() => {
        sendResponse({
          status: false,
        });
      });
    return true;
  }
});
chrome.runtime.onInstalled.addListener(() => {
  chrome.tabs.query(
    { url: "*://twitter.com/*", currentWindow: true },
    (tabs) => {
      tabs.forEach((tab) => {
        chrome.tabs.reload(tab.id);
      });
    }
  );
});
