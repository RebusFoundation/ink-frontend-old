const cheerio = require("cheerio");

const PREFIX = "/doc";

const options = {
  withDomLvl1: true,
  normalizeWhitespace: false,
  xmlMode: true,
  decodeEntities: true
};

export function parseToC(text, url) {
  const $ = cheerio.load(text, options);
  if ($("html").length !== 0) {
    return parseNavHTML($, url);
  } else {
    return parseNCX($, url);
  }
}

function parseNavHTML($, url) {
  const toc = {
    type: "html",
    url,
    children: []
  };
  if ($("html").attr("xml:lang")) {
    toc.inLanguage = $("html").attr("xml:lang");
  } else if ($("html").attr("lang")) {
    toc.inLanguage = $("html").attr("lang");
  } else if ($('nav[epub\\:type="toc"]').attr("xml\\:lang")) {
    toc.inLanguage = $('nav[epub\\:type="toc"]').attr("xml\\:lang");
  }
  const heading = $('nav[epub\\:type="toc"] > :first-child');
  const list = $('nav[epub\\:type="toc"] > ol');
  if (heading.get(0) !== list.get(0)) {
    toc.heading = heading.text();
  }
  $("a").each((i, element) => {
    const node = $(element);
    node.attr("href", getPath(node.attr("href"), url));
  });
  $('nav[epub\\:type="toc"] > ol > li').each((i, element) =>
    parseListItem(i, element, toc, $)
  );
  return toc;
}

function parseListItem(i, element, toc, $) {
  const item = $(element);
  const child = {
    children: []
  };
  if (item.find("> a").length !== 0) {
    child.label = item.find("> a").text();
    child.url = item.find("> a").attr("href");
  } else if (item.find("> span").length !== 0) {
    child.label = item.find("> span").text();
  }
  const children = item.find("> ol > li");
  children.each((i, element) => parseListItem(i, element, child, $));
  toc.children = toc.children.concat(child);
}

function parseNCX($, url) {
  const toc = {
    type: "NCX",
    url,
    children: []
  };
  toc.heading = $("docTitle > text").text();
  toc.inLanguage = $("ncx").attr("xml:lang") || "en";
  $("navMap > navPoint").each((i, element) =>
    parseNavPoint(i, element, toc, $)
  );
  return toc;
}

function parseNavPoint(i, element, toc, $) {
  const point = $(element);
  const label = point.find("> navLabel").text();
  const url = getPath(point.find("content").attr("src"), toc.url);
  const child = {
    label,
    url,
    children: []
  };
  const children = point.find("> navPoint");
  if (point.length !== 0) {
    children.each((i, element) => parseNavPoint(i, element, child, $));
  }
  toc.children = toc.children.concat(child);
}

function getPath(path, opfPath) {
  const opf = new URL(opfPath, "http://example.com/");
  // If host is example.com, then this is a local request
  const url = new URL(path, opf);
  return PREFIX + url.pathname + url.hash;
}
