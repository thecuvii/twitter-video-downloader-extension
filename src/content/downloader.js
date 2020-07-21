import axios from "axios";

export default class Downloader {
  fetch(url) {
    return axios.get(url, {
      responseType: "blob",
    });
  }

  download(url, name) {
    return this.fetch(url).then((response) => {
      const element = document.createElement("a");
      element.style.display = "none";
      document.body.appendChild(element);

      element.href = window.URL.createObjectURL(response.data);
      element.setAttribute("target", "_blank");
      element.setAttribute("download", `${name}.mp4`);
      element.click();

      window.URL.revokeObjectURL(element.href);
      document.body.removeChild(element);
    });
  }
}
