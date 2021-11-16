import Api from "./api";

let headers = [];
chrome.webRequest.onSendHeaders.addListener(
  (details) => {
    const newHeaders = details.requestHeaders.filter((header) => {
      const isHeaderInScope =
        ["x-guest-token", "x-csrf-token", "authorization"].indexOf(
          header.name
        ) > -1;
      if (!isHeaderInScope) {
        return false;
      }
      const isHeaderAlreadySet = headers.find(
        (h) => h.name === header.name && h.value === header.value
      );
      if (isHeaderAlreadySet) {
        return false;
      }
      return true;
    });

    if (newHeaders.length) {
      headers = [...headers, ...newHeaders];
    }
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
