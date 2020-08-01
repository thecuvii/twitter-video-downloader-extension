import Api from "./api";

(() => {
  let credentials;
  chrome.webRequest.onSendHeaders.addListener(
    (details) => {
      const headers = ["x-guest-token", "x-csrf-token", "authorization"];
      credentials = details.requestHeaders.filter(
        (_) => headers.indexOf(_.name) > -1
      );
    },
    { urls: ["*://api.twitter.com/2/timeline/*"], types: ["xmlhttprequest"] },
    ["requestHeaders"]
  );
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getVideoUrl") {
      const api = new Api(credentials);
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
      return true;
    }
  });
})();
