import onRequestDone from "./xhr";
import parseRequest from "./parse";
import downloadVideo from "./download";
import observeDom from "./observe";
import Button from "./button.html";
import Mustache from "mustache";

const videoList = [];
onRequestDone(function (response) {
  const requestVideos = parseRequest(response);
  if (requestVideos.length) {
    videoList.push(...requestVideos);
  }
});

observeDom(function ({ $group, $image }) {
  const findVideo = videoList.find(function (video) {
    return $image.src.indexOf(video.photo) > -1;
  });
  const checkExtensionButton = $group.getAttribute(
    "data-twitter-video-downloader-extension"
  );
  if (findVideo && !checkExtensionButton) {
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
      const mixedVideos = videoList.filter(function (v) {
        return v.entityId === findVideo.entityId;
      });
      for (const video of mixedVideos) {
        await downloadVideo(video.video, video.text);
      }
      this.classList.remove("loading");
      this.classList.add("success");
    });
  }
});
