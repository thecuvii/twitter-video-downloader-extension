import Api from "./api";
import Crypto from "sjcl";

chrome.webRequest.onSendHeaders.addListener(
  (details) => {
    const headers = ["x-guest-token", "x-csrf-token", "authorization"];
    const credentials = details.requestHeaders.filter(
      (_) => headers.indexOf(_.name) > -1
    );
    chrome.storage.sync.set({
      credentials: Crypto.encrypt(
        process.env.SECRET_KEY,
        JSON.stringify(credentials)
      ).ct,
    });
  },
  { urls: ["*://api.twitter.com/2/timeline/*"], types: ["xmlhttprequest"] },
  ["requestHeaders"]
);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getVideoUrl") {
    chrome.storage.sync.get("credentials", async (storage) => {
      const credentials = Crypto.decrypt(
        process.env.SECRET_KEY,
        storage.credentials
      );
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
