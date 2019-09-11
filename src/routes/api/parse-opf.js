// import * as fs from "fs";
import { parseOPF } from "../../api/opf-to-metadata.js";
import { getter } from "../../api/fetch.js";

export async function get(req, res, next) {
  const fetch = getter(req, res);
  // Should use getter to always fetch, no url wrangling
  if (req.user) {
    const file = req.query.opf;
    const url = new URL(file, "http://example.com/");
    try {
      const response = await fetch(file);
      const body = await response.text();
      const metadata = parseOPF(
        body,
        url.hostname === "example.com" ? url.pathname : file
      );
      // if (file.includes('pg55456-images')) {
      //   await fs.promises.writeFile(
      //     "book2.json",
      //     JSON.stringify(metadata, null, 2)
      //   );
      // }
      return res.json(metadata);
    } catch (err) {
      next(err);
    }
  } else {
    return res.sendStatus(403);
  }
}
