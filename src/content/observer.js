export default class Observer {
  observe(callback) {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((element) => {
          try {
            const playIcons = element.querySelectorAll(
              'path[d^="M20.436 11.37L5.904"]'
            );

            playIcons.forEach((icon) => {
              const isQuote = icon.closest('div[role="link"]');
              if (isQuote) {
                return false;
              }

              const isCard = icon.closest('div[data-testid="card.wrapper"]');
              if (isCard) {
                return false;
              }

              const article = icon.closest("article[role='article']");
              if (article) {
                const link = article.querySelector('a[href*="/status/"]');
                if (link) {
                  const url = link.getAttribute("href");
                  const [, , , statusId] = url.split("/");
                  callback({
                    id: statusId,
                    $el: article.querySelector('[role="group"]'),
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
