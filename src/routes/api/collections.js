import got from "got";
import { normalise } from "../../api/normalise-publication.js";
import querystring from "querystring";
const LIMIT = 25;
export async function get(req, res, next) {
  const { page = 1, collection, reverse, orderBy } = req.query;
  if (req.user && req.user.profile && req.user.profile.id) {
    try {
      let url;
      if (collection === "all") {
        const query = {
          page,
          limit: LIMIT
        };
        if (orderBy !== "datePublished") {
          query.orderBy = orderBy;
        }
        if (reverse !== "false") {
          query.reverse = reverse;
        }
        url = `${req.user.profile.id}/library?${querystring.encode(query)}`;
      } else {
        const query = {
          page,
          stack: collection,
          limit: LIMIT
        };
        if (orderBy !== "datePublished") {
          query.orderBy = orderBy;
        }
        if (reverse !== "false") {
          query.reverse = reverse;
        }
        url = `${req.user.profile.id}/library?${querystring.encode(query)}`;
      }
      const response = await got(url, {
        headers: {
          Authorization: `Bearer ${req.user.token}`
        },
        json: true
      });
      response.body.items = response.body.items.map(normalise);
      if (response.body.items.length === 0) {
        response.body.done = true;
      }
      return res.json(response.body);
    } catch (err) {
      res.status(500);
      console.error("in collection: ", err);
      res.json(err);
    }
  } else {
    res.sendStatus(404);
  }
}
