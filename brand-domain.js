/**
 * Replace hardcoded getccwpermitseasy.com with the live hostname
 * (www. stripped) everywhere in the document: text, title, hrefs.
 */
(function () {
  "use strict";

  var PLACEHOLDER = "getccwpermitseasy.com";
  var domain = (window.location.hostname || "")
    .replace(/^www\./i, "")
    .toLowerCase();

  if (!domain) return;

  function swap(str) {
    if (!str || str.indexOf(PLACEHOLDER) === -1) return str;
    return str.split(PLACEHOLDER).join(domain);
  }

  function run() {
    document.title = swap(document.title);

    if (document.body) {
      var walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        null,
      );
      var textNodes = [];
      while (walker.nextNode()) textNodes.push(walker.currentNode);
      for (var i = 0; i < textNodes.length; i++) {
        var node = textNodes[i];
        if (node.nodeValue && node.nodeValue.indexOf(PLACEHOLDER) !== -1) {
          node.nodeValue = swap(node.nodeValue);
        }
      }
    }

    var attrs = ["href", "content", "src", "action", "cite"];
    var all = document.querySelectorAll("*");
    for (var a = 0; a < all.length; a++) {
      var el = all[a];
      for (var b = 0; b < attrs.length; b++) {
        var name = attrs[b];
        if (!el.hasAttribute(name)) continue;
        var val = el.getAttribute(name);
        if (val && val.indexOf(PLACEHOLDER) !== -1) {
          el.setAttribute(name, swap(val));
        }
      }
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();
