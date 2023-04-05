import expressSession from 'express-session';
import SessionStore from 'connect-redis';
import redis from 'redis';
import type * as express from 'express';

import * as store from './util/store';

const client = redis.createClient({
  url: process.env.REDIS_URL
});

client.connect().catch(console.error);

/**
 * Middleware for setting up required OWASP HTTP response headers.
 */
export const setResponseHeaders: express.RequestHandler = (req, res, next) => {
  res.setHeader('Strict-Transport-Security', 'max-age=31536000');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // This CSP is an example, it might not work for your webpage(s)
  // You can generate correct CSP for your webpage here https://www.cspisawesome.com/
  const publicUrl = process.env.PUBLIC_URL;
  const { host } = new URL(publicUrl);

  res.setHeader(
    'Content-Security-Policy',
    `default-src *; style-src 'self' 'unsafe-inline'; script-src * 'self' https://appssdk.zoom.us 'unsafe-inline'; connect-src * 'self' wss://${host}/sockjs-node; img-src 'self' data: https://images.unsplash.com; base-uri 'self'; form-action 'self';`
  );

  res.setHeader('Referrer-Policy', 'same-origin');
  res.setHeader('X-Frame-Option', 'same-origin');
  next();
};

/**
 * Middleware for zoom app session.
 */
export const session = expressSession({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    path: '/',
    httpOnly: true,
    maxAge: 365 * 24 * 60 * 60 * 1000,
  },
  store: new SessionStore({
    client
  }),
});

/**
 * Middleware for protected routes.
 * Routes behind this will only show if the user has a Zoom App session and an Auth0 id token.
 */
export const requiresThirdPartyAuth: express.RequestHandler = async (req, res, next) => {
  if (req.session.user) {
    try {
      const user = await store.getUser(req.session.user)
      req.thirdPartyAccessToken = user.thirdPartyAccessToken

      return next()
    } catch (error) {
      return next(
        new Error(
          'Error getting app user from session.  The user may have added from In-Client OAuth'
        )
      )
    }
  } else {
    next(new Error('Unkown or missing session'))
  }
};
