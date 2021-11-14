import * as Sentry from "@sentry/browser";
import { Integrations } from "@sentry/tracing";

import Api from "./api";

Sentry.init({
  dsn: "https://fc848409a9c3467aa951cebecef8669d@o311889.ingest.sentry.io/6057986",
  // eslint-disable-next-line no-undef
  release: chrome.runtime.getManifest().version,
  integrations: [
    new Integrations.BrowserTracing({
      routingInstrumentation: () => {},
    }),
  ],
  tracesSampleRate: 1.0,
  ignoreErrors: ["ResizeObserver loop limit exceeded"],
});

let headers = {};
chrome.webRequest.onSendHeaders.addListener(
  (details) => {
    const availableHeaders = ["x-guest-token", "x-csrf-token", "authorization"];
    details.requestHeaders.forEach((header) => {
      if (availableHeaders.indexOf(header.name) > -1 && header.value) {
        headers[header.name] = header.value;
      }
    });
  },
  { urls: ["*://twitter.com/i/api/*"], types: ["xmlhttprequest"] },
  ["requestHeaders"]
);
const api = new Api();
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getVideoUrl") {
    api
      .fetch(headers, request.id)
      .then((response) => {
        sendResponse({
          status: true,
          url: response.url,
          name: response.name,
        });
      })
      .catch((error) => {
        Sentry.withScope(async (scope) => {
          scope.setExtra("length", headers.length);
          Sentry.captureException(error);
        });
        sendResponse({
          status: false,
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
