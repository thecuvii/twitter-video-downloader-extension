import * as Sentry from "@sentry/browser";
import { Integrations } from "@sentry/tracing";

import Observer from "./observer";
import Downloader from "./downloader";
import Mustache from "mustache";
import Button from "./button.html";

Sentry.init({
  dsn: "https://fc848409a9c3467aa951cebecef8669d@o311889.ingest.sentry.io/6057986",
  // eslint-disable-next-line no-undef
  release: chrome.runtime.getManifest().version,
  integrations: [new Integrations.BrowserTracing()],
  tracesSampleRate: 1.0,
});

const observer = new Observer();

observer.observe((tweet) => {
  if (!tweet.$el.classList.contains("button-group")) {
    tweet.$el.classList.add("button-group");
    const { width, height } = tweet.$el
      .querySelector("svg")
      .getBoundingClientRect();

    const button = document.createElement("button");
    button.addEventListener("click", () => {
      button.classList.add("loading");
      chrome.runtime.sendMessage(
        { action: "getVideoUrl", id: tweet.id },
        async (response) => {
          if (response && response.status) {
            await Downloader.download(response.url, response.name);
            button.classList.add("success");
          } else {
            Sentry.captureMessage(response.message);
            button.classList.add("error");
          }

          button.disabled = true;
          button.classList.remove("loading");
        }
      );
    });

    button.insertAdjacentHTML(
      "beforeend",
      Mustache.render(Button, {
        width,
        height,
      })
    );

    tweet.$el.appendChild(button);
  }
});
