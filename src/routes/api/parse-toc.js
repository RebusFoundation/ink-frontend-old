import * as fs from "fs";
import { parseToC } from "../../api/toc-to-json.js";
import { getter } from "../../api/fetch.js";

export async function get(req, res, next) {
  const fetch = getter(req, res);
  if (req.user) {
    // Should use getter to always fetch, no url wrangling
    const file = req.query.toc;
    const url = new URL(file, "http://example.com/");
    const response = await fetch(file);
    const body = await response.text();
    try {
      const toc = parseToC(
        body,
        url.hostname === "example.com" ? url.pathname : file
      );
      if (file.includes("childrens-literature")) {
        await fs.promises.writeFile(
          "childrens-literature.json",
          JSON.stringify(toc, null, 2)
        );
      }
      if (file.includes("pg55456-images")) {
        await fs.promises.writeFile(
          "pg55456-images.json",
          JSON.stringify(toc, null, 2)
        );
      }
      return res.json(toc);
    } catch (err) {
      next(err);
    }
  } else {
    return res.sendStatus(403);
  }
}
