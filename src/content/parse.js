export default function (response) {
  // tweet entites
  const entities = [...findEntities(response, "extended_entities")];

  // tweet card entites
  const cards = [...findEntities(response, "string_value")]
    .map(function (value) {
      try {
        const parsedValue = JSON.parse(value.string_value);
        const mediaEntity = Object.values(parsedValue.media_entities)
          .filter(function (media) {
            return ["video", "animated_gif"].indexOf(media.type) > -1;
          })
          .shift();
        if (mediaEntity) {
          return {
            extended_entities: {
              media: [mediaEntity],
            },
          };
        }
      } catch (ex) {
        return false;
      }
      return false;
    })
    .filter(Boolean);

  return [...cards, ...entities]
    .filter(function (entity) {
      return entity.extended_entities.media.filter(function (media) {
        return ["video", "animated_gif"].indexOf(media.type) > -1;
      }).length;
    })
    .map(function (entity) {
      const {
        extended_entities: { media },
      } = entity;

      return media
        .map(function (item) {
          const video = item.video_info.variants
            .filter(function (variant) {
              return variant.content_type === "video/mp4";
            })
            .sort(function (first, second) {
              return second.bitrate - first.bitrate;
            })
            .shift();
          return {
            id: item.id_str,
            photo: item.media_url_https.substr(
              0,
              item.media_url_https.lastIndexOf(".")
            ),
            video: video.url,
          };
        })
        .shift();
    })
    .filter(function (video, index, self) {
      return self.indexOf(video) === index;
    });
}

function* findEntities(source, search) {
  if (!source) {
    return;
  }
  const [key] = Object.keys(source);
  if (key === undefined) {
    return;
  }
  const { [key]: value, ...rest } = source;
  if (key === search) {
    yield source;
  }
  if (typeof value === "object") {
    yield* findEntities(value, search);
  }
  yield* findEntities(rest, search);
}
