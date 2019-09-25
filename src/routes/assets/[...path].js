import got from "got";
import createDOMPurify from "dompurify/dist/purify.es.js";
import { JSDOM } from "jsdom";
import * as xml from "xmlserializer";

const purifyConfig = {
  KEEP_CONTENT: false,
  IN_PLACE: true,
  ADD_ATTR: ["epub:type", "xmlns:epub"],
  ADD_TAGS: ["link"],
  WHOLE_DOCUMENT: true
};

export async function get(req, res, next) {
  const { path } = req.params;
  const url = new URL(path.join("/"), process.env.API_SERVER).href
  res.set("Cache-Control", "max-age=31536000, immutable");
  if (req.user) {
    try {
      const redirect = await got.head(url, {
        followRedirect: false,
        headers: {
          Authorization: `Bearer ${req.user.token}`
        }
      });
      let response;
      if (redirect.headers.location && redirect.statusCode === 302) {
        response = await got.head(redirect.headers.location);
      }
      if (response.headers["content-type"].includes("svg")) {
        const mainresponse = await got(url);
        const dom = new JSDOM(mainresponse.body, {
          contentType: response.headers["content-type"]
        });
        const window = dom.window;
        const DOMPurify = createDOMPurify(window);
        const clean = DOMPurify.sanitize(
          window.document.documentElement,
          purifyConfig
        );
        const result = xml.serializeToString(clean);
        res.type("svg");
        res.send(result);
      } else if (
        response.headers["content-type"].includes("image") ||
        response.headers["content-type"].includes("video") ||
        response.headers["content-type"].includes("application/epub+zip") ||
        response.headers["content-type"].includes("application/pdf")
      ) {
        return got.stream(redirect.headers.location).pipe(res);
      } else {
        return res.sendStatus(404);
      }
    } catch (err) {
      return res.sendStatus(404);
    }
  }
}
