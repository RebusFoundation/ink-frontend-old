import { getter } from "../../api/fetch.js";
import { chapterToJSON } from "../../api/chapter-to-json";

export async function get(req, res, next) {
  const fetch = getter(req, res);
  if (req.user) {
    const file = req.query.chapter;
    const index = req.query.index;
    const url = new URL(file, "http://example.com/");
    try {
      const response = await fetch(file);
      const body = await response.text();
      const chapter = await chapterToJSON(
        body,
        url.hostname === "example.com" ? url.pathname : file,
        response.headers.get("Content-Type"),
        index
      );
      return res.json(chapter);
    } catch (err) {
      console.error(err);
      next(err);
    }
  } else {
    return res.sendStatus(403);
  }
}
