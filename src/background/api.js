import axios from "axios";

export default class Api {
  constructor(credentials) {
    axios.defaults.baseURL =
      "https://twitter.com/i/api/2/timeline/conversation/";
    credentials.forEach((credential) => {
      axios.defaults.headers.common[credential.name] = credential.value;
    });
  }

  fetch(id) {
    return axios.get(`${id}.json?tweet_mode=extended`).then((response) => {
      const tweet = response.data.globalObjects.tweets[id];
      const media = tweet.extended_entities.media[0];
      const videos = media.video_info.variants.filter(
        (_) => _.content_type === "video/mp4"
      );

      return {
        url: videos[0].url,
        name: tweet.full_text.substring(0, 50),
      };
    });
  }
}
