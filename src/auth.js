// import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import csurf from "csurf";
import dotenv from "dotenv";
// import ms from 'ms'
import debugSetup from "debug";
const debug = debugSetup("vonnegut:auth");
const result = dotenv.config();
if (result.error) {
  throw result.error;
}
function generateToken(user) {
  const expiresIn = "30m";
  return jwt.sign({ sub: user.id }, process.env.SECRETORKEY, {
    algorithm: "HS256",
    expiresIn,
    audience: process.env.AUDIENCE,
    issuer: process.env.ISSUER
  });
}

export function setup(app) {
  passport.serializeUser((user, done) => {
    // console.log('serialise: ', user)
    done(null, user);
  });
  passport.deserializeUser((user, done) => {
    // console.log('deserialise: ', user)
    if (!user.token) {
      user.token = generateToken(user);
      done(null, user);
    } else if (user.token) {
      jwt.verify(
        user.token,
        process.env.SECRETORKEY,
        {
          algorithm: "HS256",
          audience: process.env.AUDIENCE,
          issuer: process.env.ISSUER
        },
        (err, decoded) => {
          if (err && err.name === "TokenExpiredError") {
            user.token = generateToken(user);
            done(null, user);
          } else if (err) {
            debug(err);
            return done(err);
          } else {
            return done(null, user);
          }
        }
      );
    }
  });
  app.use(passport.initialize());
  app.use(passport.session());
  if (process.env.PASSPORT_STRATEGY === "auth0") {
    app.get("/callback", passport.authenticate("auth0", {}), function(
      req,
      res,
      next
    ) {
      res.redirect(req.session.returnTo || "/");
    });
  }
  app.use(
    "/login",
    passport.authenticate(process.env.PASSPORT_STRATEGY),
    function(req, res, next) {
      res.redirect(req.query.returnTo || "/");
    }
  );
  app.use("/logout", (req, res) => {
    if (!req.user) return res.redirect("/");
    req.session = null;
    req.logout();
    let redirect;
    if (process.env.PASSPORT_STRATEGY === "auth0") {
      redirect = `https://${process.env.AUTH0_DOMAIN}/v2/logout?client_id=${process.env.AUTH0_CLIENT_ID}&returnTo=/`;
    } else {
      redirect = "/";
    }
    res.redirect(redirect);
  });
  app.use(csurf());
  app.use((req, res, next) => {
    res.cookie("XSRF-TOKEN", req.csrfToken());
    next();
  });
}
