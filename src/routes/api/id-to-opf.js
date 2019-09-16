// import * as fs from "fs";
import { parseOPF } from "../../api/opf-to-metadata.js";
import got from "got";
import { normalise } from "../../api/normalise-publication.js";

export async function get(req, res, next) {
  if (!req.user) return res.sendStatus(404);
  const file = req.query.id;
  try {
    const url = new URL(file, process.env.API_SERVER);
    const response = await got.get(url.href, {
      headers: {
        Authorization: `Bearer ${req.user.token}`
      },
      json: true
    });
    const book = response.body;
    const opf = book.resources.find(
      item => item.encodingFormat === "application/oebps-package+xml"
    );
    if (opf.url === "original.opf") {
      return res.json(normalise(book));
    } else {
      const url = new URL(opf.url, process.env.API_SERVER);
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
      const metadata = parseOPF(body, url.href);
      // if (file.includes('pg55456-images')) {
      //   await fs.promises.writeFile(
      //     "book2.json",
      //     JSON.stringify(metadata, null, 2)
      //   );
      // }
      if (book.position) {
        metadata.position = book.position;
      }
      return res.json(metadata);
    }
  } catch (err) {
    console.log(err);
    res.status(500);
    res.json(JSON.stringify(err));
  }
}
