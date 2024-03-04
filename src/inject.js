const element = document.createElement("script");
element.src = chrome.runtime.getURL("content.js");
(document.head || document.documentElement).appendChild(element);
