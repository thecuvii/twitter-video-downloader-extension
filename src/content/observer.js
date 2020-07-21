export default class Observer {
  observe(callback) {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((element) => {
          try {
            const videos = element.querySelectorAll(
              'div[data-testid="previewInterstitial"], div[data-testid="placementTracking"]'
            );

            videos.forEach((video) => {
              const article = video.closest("article[role='article']");
              const isBlockquote = article.querySelector('[role="blockquote"]');

              if (!isBlockquote) {
                let link;

                const time = article.querySelector("time[datetime]");
                if (time) {
                  link = time.parentNode;
                } else {
                  link = article.querySelector(
                    'a[href*="/retweets/with_comments"]'
                  );
                }

                const buttonGroup = article.querySelector('[role="group"]');

                if (link && buttonGroup) {
                  const url = link.getAttribute("href");
                  const [, , , statusId] = url.split("/");

                  callback({
                    id: statusId,
                    $el: buttonGroup,
                  });
                }
              }
            });
          } catch (ex) {}
        });
      });
    });
    observer.observe(document, { childList: true, subtree: true });
  }
}
