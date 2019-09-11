import { getter } from "../../api/fetch.js";
import { cleanCSS } from "../../api/clean-css.js";
// import * as fs from 'fs'
export async function get(req, res, next) {
  if (req.user) {
    const fetch = getter(req, res);
    const file = req.query.css;
    const url = new URL(file, "http://example.com/");
    try {
      const response = await fetch(file);
      const body = await response.text();
      const style = await cleanCSS(
        body,
        url.hostname === "example.com" ? url.pathname : file
      );
      res.set("Content-Type", "text/css");
      // fs.writeFileSync('epub.css', style, 'utf8')
      return res.send(style);
    } catch (err) {
      console.log("clean: ", err);
      next(err);
    }
  } else {
    return res.sendStatus(403);
  }
}
