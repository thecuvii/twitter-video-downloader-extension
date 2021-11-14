export default class Downloader {
  static download(url, name) {
    return fetch(url)
      .then((response) => response.blob())
      .then((response) => {
        const element = document.createElement("a");
        element.style.display = "none";
        document.body.appendChild(element);
        element.href = window.URL.createObjectURL(response);
        element.setAttribute("target", "_blank");
        element.setAttribute("download", `${name}.mp4`);
        element.click();

        window.URL.revokeObjectURL(element.href);
        document.body.removeChild(element);
      });
  }
}
