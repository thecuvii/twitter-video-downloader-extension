export default class Api {
  fetch(apiOrigin, id, headers = {}) {
    return fetch(
      `${apiOrigin}/i/api/2/timeline/conversation/${id}.json?tweet_mode=extended`,
      {
        credentials: "include",
        headers: new Headers(headers),
      }
    )
      .then((response) => response.json())
      .then((response) => {
        const {
          globalObjects: { tweets },
        } = response;
        let tweet = tweets[id];
        if (!tweet.extended_entities && tweet.quoted_status_id_str) {
          tweet = tweets[tweet.quoted_status_id_str];
        }
        const media = tweet.extended_entities.media[0];
        const videos = media.video_info.variants.filter(
          (_) => _.content_type === "video/mp4"
        );

        const orderVideosByBitrate = videos.sort(
          (a, b) => b.bitrate - a.bitrate
        );
        return {
          url: orderVideosByBitrate[0].url,
          name: tweet.full_text.substring(0, 50),
        };
      });
  }
}
