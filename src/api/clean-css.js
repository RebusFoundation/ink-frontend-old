import createDOMPurify from "dompurify/dist/purify.es.js";
import { JSDOM } from "jsdom";
import { testProp } from "./allowed-css-props.js";

const purifyConfig = {
  KEEP_CONTENT: false,
  IN_PLACE: true,
  WHOLE_DOCUMENT: true,
  ALLOW_TAGS: ["reader-highlight"],
  FORBID_TAGS: ["meta", "form", "title", "link"],
  FORBID_ATTR: ["srcset", "action", "background", "poster"]
};

export async function cleanCSS(text, url) {
  const dom = new JSDOM(
    `<html><head><style>${text}</style></head><body></body></html>`,
    {
      contentType: "text/html"
    }
  );
  const window = dom.window;
  const DOMPurify = createDOMPurify(window);
  // Based on sample from https://github.com/cure53/DOMPurify/tree/master/demos, same license as DOMPurify
  const regex = /(url\("?)(?!data:)/gim;

  function replacer(match, p1) {
    try {
      const url = new URL(p1, window.location);
      if (url.host === window.location.host) {
        return p1;
      } else {
        return "";
      }
    } catch (err) {
      console.error(err);
      return "";
    }
  }

  function addStyles(output, styles) {
    for (var prop = styles.length - 1; prop >= 0; prop--) {
      if (styles[styles[prop]]) {
        var url = styles[styles[prop]].replace(regex, replacer);
        styles[styles[prop]] = url;
      }
      if (
        styles[styles[prop]] &&
        typeof styles[styles[prop]] === "string" &&
        testProp(styles[prop], styles[styles[prop]])
      ) {
        output.push(styles[prop] + ":" + styles[styles[prop]] + ";");
      }
    }
  }

  function addCSSRules(output, cssRules) {
    for (var index = cssRules.length - 1; index >= 0; index--) {
      var rule = cssRules[index];
      // check for rules with selector
      if (rule.type === 1 && rule.selectorText) {
        output.push(rule.selectorText + "{");
        if (rule.style) {
          addStyles(output, rule.style);
        }
        output.push("}");
        // check for @media rules
      } else if (rule.type === rule.MEDIA_RULE) {
        output.push("@media " + rule.media.mediaText + "{");
        addCSSRules(output, rule.cssRules);
        output.push("}");
        // check for @font-face rules
      } else if (rule.type === rule.FONT_FACE_RULE) {
        output.push("@font-face {");
        if (rule.style) {
          addStyles(output, rule.style);
        }
        output.push("}");
        // check for @keyframes rules
      } else if (rule.type === rule.KEYFRAMES_RULE) {
        output.push("@keyframes " + rule.name + "{");
        for (var i = rule.cssRules.length - 1; i >= 0; i--) {
          var frame = rule.cssRules[i];
          if (frame.type === 8 && frame.keyText) {
            output.push(frame.keyText + "{");
            if (frame.style) {
              addStyles(output, frame.style);
            }
            output.push("}");
          }
        }
        output.push("}");
      }
    }
  }

  DOMPurify.addHook("uponSanitizeElement", function(node, data) {
    if (data.tagName === "style") {
      var output = [];
      addCSSRules(output, node.sheet.cssRules);
      node.textContent = output.join("\n");
    }
  });

  DOMPurify.addHook("afterSanitizeAttributes", function(node) {
    if (node.hasAttribute("style")) {
      var styles = node.style;
      var output = [];
      for (var prop = styles.length - 1; prop >= 0; prop--) {
        // we re-write each property-value pair to remove invalid CSS
        if (node.style[styles[prop]] && regex.test(node.style[styles[prop]])) {
          var url = node.style[styles[prop]].replace(regex, replacer);
          node.style[styles[prop]] = url;
        }
        output.push(styles[prop] + ":" + node.style[styles[prop]] + ";");
      }
      // re-add styles in case any are left
      if (output.length) {
        node.setAttribute("style", output.join(""));
      } else {
        node.removeAttribute("style");
      }
    }
  });
  const clean = DOMPurify.sanitize(
    window.document.documentElement,
    purifyConfig
  );
  return clean.querySelector("style").textContent;
}
