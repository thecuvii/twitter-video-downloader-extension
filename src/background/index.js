import Api from "./api";

chrome.webRequest.onSendHeaders.addListener(
  (details) => {
    const headers = ["x-guest-token", "x-csrf-token", "authorization"];
    const credentials = details.requestHeaders.filter(
      (header) => headers.indexOf(header.name) > -1
    );
    chrome.storage.sync.set({
      credentials,
    });
  },
  { urls: ["*://api.twitter.com/2/timeline/*"], types: ["xmlhttprequest"] },
  ["requestHeaders"]
);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getVideoUrl") {
    chrome.storage.sync.get("credentials", async (storage) => {
      const api = new Api(storage.credentials);
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
          sendResponse({ status: false, message: error.message });
        });
    });
    return true;
  }
});
