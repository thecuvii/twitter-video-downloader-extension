import onRequestDone from "./xhr";
import parseRequest from "./parse";
import downloadVideo from "./download";
import observeDom from "./observe";
import Button from "./button.html";
import Mustache from "mustache";

const videos = [];
onRequestDone(function (response) {
  const requestVideos = parseRequest(response);
  if (requestVideos.length) {
    videos.push(...requestVideos);
  }
});

observeDom(function ({ $group, $image }) {
  const checkVideo = videos.find(function (video) {
    return $image.src.indexOf(video.photo) > -1;
  });
  const checkExtensionButton = $group.getAttribute(
    "data-twitter-video-downloader-extension"
  );
  if (checkVideo && !checkExtensionButton) {
    $group.setAttribute("data-twitter-video-downloader-extension", "true");
    const { width, height } = $group
      .querySelector("svg")
      .getBoundingClientRect();

    const $button = document.createElement("button");
    $button.classList.add("extension-button");
    $button.setAttribute("role", "button");
    $button.insertAdjacentHTML(
      "beforeend",
      Mustache.render(Button, {
        width,
        height,
      })
    );
    $group.appendChild($button);
    $button.addEventListener("click", async function (event) {
      event.preventDefault();
      this.disabled = true;
      this.classList.add("loading");
      await downloadVideo(checkVideo.video, checkVideo.text);
      this.classList.remove("loading");
      this.classList.add("success");
    });
  }
});
