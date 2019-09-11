import got from "got";
export async function get(req, res, next) {
  const data = { user: req.user };
  if (req.user) {
    try {
      const response = await got(`${process.env.API_SERVER}whoami`, {
        headers: {
          Authorization: `Bearer ${req.user.token}`
        },
        json: true
      });
      const { id, outbox } = response.body;
      data.profile = { id, outbox, status: response.statusCode };
    } catch (err) {
      data.profile = {
        status: err.statusCode,
        create: `${process.env.API_SERVER}readers`
      };
    }
  }
  req.session.profile = data.profile;
  return res.json(data);
}
