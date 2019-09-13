import createDOMPurify from "dompurify/dist/purify.es.js";
import { JSDOM } from "jsdom";
import { testProp } from "./allowed-css-props.js";
// import serializer from 'xmlserializer'
// import * as fs from "fs";

const purifyConfig = {
  KEEP_CONTENT: false,
  IN_PLACE: true,
  WHOLE_DOCUMENT: true,
  ALLOW_TAGS: ["reader-highlight"],
  FORBID_TAGS: ["meta", "form", "title", "link"],
  FORBID_ATTR: ["srcset", "action", "background", "poster"]
};
const tagLocations = [
  "p",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "table",
  "svg",
  "hr",
  "form",
  "details",
  "ul",
  "ol",
  "dl",
  "figure",
  "blockquote",
  "aside"
];

export async function chapterToJSON(
  chapter,
  chapterPath,
  contentType = "text/html",
  index
) {
  let locations = 0;
  let h1 = 0;
  let h2 = 0;
  const order = parseInt(index, 10) + 1;
  const dom = new JSDOM(chapter, {
    contentType
  });
  const window = dom.window;
  const stylesheets = Array.from(
    window.document.querySelectorAll('link[rel="stylesheet"]')
  ).map(node => getPath(node.getAttribute("href"), chapterPath));
  const headingElement = window.document.querySelector("h1");
  let heading;
  if (headingElement) {
    heading = headingElement.textContent;
  }
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
        testProp(styles[prop])
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
    } else if (tagLocations.indexOf(data.tagName) !== -1) {
      if (data.tagName === "h1") {
        h1 = h1 + 1;
        locations = 0;
      } else if (data.tagName === "h2") {
        h2 = h2 + 1;
        locations = 0;
      }
      node.dataset.location = `${order}.${h1}.${h2}.${locations++}`;
    }
    if (
      node.getAttributeNS &&
      node.getAttributeNS("http://www.idpf.org/2007/ops", "type")
    ) {
      node.dataset.epubType = node.getAttributeNS(
        "http://www.idpf.org/2007/ops",
        "type"
      );
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
    if (node.hasAttribute("src")) {
      node.setAttribute("src", assetPath(node.getAttribute("src"), chapterPath));
    }
    if (node.hasAttribute("href")) {
      node.setAttribute(
        "href",
        linkPath(node.getAttribute("href"), chapterPath)
      );
    }
  });
  const clean = DOMPurify.sanitize(
    window.document.documentElement,
    purifyConfig
  );
  let html = "";
  clean.querySelectorAll("style").forEach(element => {
    element.removeAttribute("xmlns");
    html =
      html +
      element.outerHTML.replace(' xmlns="http://www.w3.org/1999/xhtml"', "");
  });
  html =
    html +
    clean
      .querySelector("body")
      .innerHTML.replace(' xmlns="http://www.w3.org/1999/xhtml"', "");
  const result = { html, stylesheets, heading };
  // await fs.promises.writeFile(
  //   "epub.html.json",
  //   JSON.stringify(result)
  // );
  return result;
}

function getPath(path, base) {
  return new URL(path, base).href;
}

function assetPath (path, base) {
  const url = new URL(path, base).href
  return `/assets/${encodeURIComponent(url)}`
}

function linkPath (path, base) {
  const url = new URL(path, base)
  return `/doc/${url.pathname}${url.hash}`
}