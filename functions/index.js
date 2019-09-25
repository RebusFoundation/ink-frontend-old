const functions = require('firebase-functions');
const env = functions.config()
process.env.EPUB_PREFIX = env.epub.prefix
process.env.API_SERVER = env.api.server
process.env.PASSPORT_STRATEGY = env.passport.strategy
process.env.COOKIE_KEY = env.cookie.key
process.env.AUTH0_CLIENT_ID = env.auth0.clientid
process.env.AUTH0_CLIENT_SECRET = env.auth0.clientsecret
process.env.AUTH0_DOMAIN = env.auth0.domain
process.env.CALLBACK_URL = env.callback.url
process.env.ISSUER = env.token.issuer
process.env.AUDIENCE = env.token.audience
process.env.SECRETORKEY = env.token.secret
process.env.SIGNOUTURL = env.signout.url

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

const express = require('express');

// We have to import the built version of the server middleware.
const { app } = require('./__sapper__/build/server/server');

// exports.ssr = functions.https.onRequest(app);
exports.ssr = functions.https.onRequest(app);