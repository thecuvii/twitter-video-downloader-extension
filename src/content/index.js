import Observer from "./observer";
import Downloader from "./downloader";
import Mustache from "mustache";
import Button from "./button.html";

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
          if (response?.status) {
            await Downloader.download(response.url, response.name);
            button.classList.add("success");
          } else {
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
