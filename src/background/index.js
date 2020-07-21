import Api from "./api";
import Crypto from "sjcl";

(() => {
  let RANDOM_KEY;
  chrome.webRequest.onSendHeaders.addListener(
    (details) => {
      const headers = ["x-guest-token", "x-csrf-token", "authorization"];
      const credentials = details.requestHeaders.filter(
        (_) => headers.indexOf(_.name) > -1
      );
      RANDOM_KEY = Crypto.random.randomWords(8);
      chrome.storage.sync.set({
        credentials: Crypto.encrypt(RANDOM_KEY, JSON.stringify(credentials)),
      });
    },
    { urls: ["*://api.twitter.com/2/timeline/*"], types: ["xmlhttprequest"] },
    ["requestHeaders"]
  );
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getVideoUrl") {
      chrome.storage.sync.get("credentials", async (storage) => {
        const credentials = Crypto.decrypt(RANDOM_KEY, storage.credentials);
        const api = new Api(JSON.parse(credentials));
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
})();
