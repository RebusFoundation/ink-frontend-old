import express from "express";
import passport from "passport";
import compression from "compression";
import * as sapper from "@sapper/server";
import Auth0Strategy from "passport-auth0";
import cookieSession from "cookie-session";
import sirv from "sirv";
import { setup } from "./auth.js";
import { devServer } from "./dev-server.js";
import csurf from "csurf";
// import debugSetup from 'debug'
// const debug = debugSetup('vonnegut:server')

const { NODE_ENV } = process.env;
const dev = NODE_ENV === "development";

const app = express();

app.enable("strict routing");
app.disable("x-powered-by");
app.set("trust proxy", true);

app.use(express.urlencoded({ extended: true }));
app.use(
  express.json({
    type: [
      "application/json",
      "application/activity+json",
      "application/ld+json"
    ],
    limit: "100mb"
  })
);
app.use(compression({ threshold: 0 }));

app.use(
  cookieSession({
    name: "sod",
    keys: [process.env.COOKIE_KEY],
    secure: !dev,
    signed: true,
    maxAge: 30 * 24 * 60 * 60 * 1000
  })
);
// Make sure the session doesn't expire as long as there is activity
app.use(function(req, res, next) {
  if (req.session) {
    req.sessionOptions.maxAge = req.session.maxAge || req.sessionOptions.maxAge;
  }
  next();
});
app.use(csurf());

if (process.env.PASSPORT_STRATEGY === "auth0") {
  passport.use(
    new Auth0Strategy(
      {
        domain: process.env.AUTH0_DOMAIN,
        clientID: process.env.AUTH0_CLIENT_ID,
        clientSecret: process.env.AUTH0_CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL
      },
      (accessToken, refreshToken, extraParams, profile, done) => {
        return done(null, profile);
      }
    )
  );
}
setup(app);

if (dev) {
  devServer(app, sapper);
} else {
  app.use(
    sirv("static", { dev }),

    sapper.middleware({
      session: (req, res) => {
        let profile;
        if (req.session && req.session.profile) {
          profile = req.session.profile;
        }
        return {
          user: req.user,
          profile
        };
      }
    })
  );
}

export { sapper };

// Need to set this up to actually use https.
