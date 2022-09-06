export default function (callback) {
  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      mutation.addedNodes.forEach(function ($element) {
        if ($element instanceof HTMLElement === false) {
          return false;
        }
        if ($element.nodeName === "IMG") {
          const $container = $element.closest("article[role='article']");
          if ($container) {
            const $group = $container.querySelector(
              "[role='group']:last-child"
            );
            if ($group) {
              callback({
                $image: $element,
                $group: $group,
              });
            }
          }
        }
      });
    });
  });
  observer.observe(document, { childList: true, subtree: true });
}
