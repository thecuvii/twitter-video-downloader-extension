import Observer from "./observer";
import Downloader from "./downloader";
import Mustache from "mustache";
import Button from "./button.html";

const observer = new Observer();
const downloader = new Downloader();

observer.observe((tweet) => {
  if (!tweet.$el.classList.contains("button-group")) {
    tweet.$el.classList.add("button-group");
    const { clientWidth, clientHeight } = tweet.$el.querySelector("svg");

    const button = document.createElement("button");
    button.addEventListener("click", () => {
      button.classList.add("loading");
      chrome.runtime.sendMessage(
        { action: "getVideoUrl", id: tweet.id },
        async (response) => {
          if (response && response.status) {
            await downloader.download(response.url, response.name);
          }
          button.classList.remove("loading");
        }
      );
    });

    button.insertAdjacentHTML(
      "beforeend",
      Mustache.render(Button, {
        clientWidth,
        clientHeight,
      })
    );

    tweet.$el.appendChild(button);
  }
});
