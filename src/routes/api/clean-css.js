import got from "got";
import { cleanCSS } from "../../api/clean-css.js";
// import * as fs from 'fs'
export async function get(req, res, next) {
  if (req.user) {
    const file = req.query.css;
    try {
      const url = new URL(file, process.env.API_SERVER);
      const redirect = await got.head(url.href, {
        followRedirect: false,
        headers: {
          Authorization: `Bearer ${req.user.token}`
        }
      });
      let body;
      if (redirect.headers.location && redirect.statusCode === 302) {
        const response = await got.get(redirect.headers.location, {
          json: false
        });
        body = await response.body;
      } else {
        return res.sendStatus(404);
      }
      const style = await cleanCSS(body, url.href);
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
