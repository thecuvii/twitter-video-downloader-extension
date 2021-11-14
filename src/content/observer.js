export default class Observer {
  observe(callback) {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((element) => {
          if (element instanceof HTMLElement === false) {
            return false;
          }

          const playIcon = element.querySelector(
            'path[d="M20.436 11.37L5.904 2.116c-.23-.147-.523-.158-.762-.024-.24.132-.39.384-.39.657v18.5c0 .273.15.525.39.657.112.063.236.093.36.093.14 0 .28-.04.402-.117l14.53-9.248c.218-.138.35-.376.35-.633 0-.256-.132-.495-.348-.633z"]'
          );
          if (!playIcon) {
            return false;
          }

          const isCard = playIcon.closest('div[data-testid="card.wrapper"]');
          if (isCard) {
            return false;
          }

          const tweetContainer = playIcon.closest("article[role='article']");
          if (!tweetContainer) {
            return false;
          }

          const anchor = tweetContainer.querySelector('a[href*="/status/"]');
          if (!anchor) {
            return false;
          }

          const url = anchor.getAttribute("href");
          const [, , , statusId] = url.split("/");
          callback({
            id: statusId,
            $el: tweetContainer.querySelector('[role="group"]'),
          });
        });
      });
    });
    observer.observe(document, { childList: true, subtree: true });
  }
}
