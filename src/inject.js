import browser from "webextension-polyfill";

const element = document.createElement("script");
element.src = browser.runtime.getURL("content.js");
(document.head || document.documentElement).appendChild(element);
