import "./config";

import path from 'path';
import http from 'http';
import express from 'express';
import morgan from 'morgan';
import { WebSocket, WebSocketServer } from 'ws';

import * as middleware from './middleware';
import zoomAppRouter from './api/zoom-app/router';
import thirdPartyOAuthRouter from './api/thirdpartyauth/router';
import zoomRouter from './api/zoom/router';
import { decCounter, getCounter, incCounter } from "./util/store";

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

export const app = express();

// Set view engine (for system browser error pages)
app.set('view engine', 'pug');

// Set universal middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(middleware.session);
app.use(middleware.setResponseHeaders);

// Set static file directory (for system browser error pages)
app.use('/', express.static(__dirname + '/public'));

// TODO: Add routes for logic

// Zoom App routes
app.use('/api/zoomapp', zoomAppRouter);

if (
  process.env.AUTH0_CLIENT_ID &&
  process.env.AUTH0_CLIENT_SECRET &&
  process.env.AUTH0_ISSUER_BASE_URL
) {
  app.use('/api/auth0', thirdPartyOAuthRouter);
} else {
  console.log('Please add Auth0 env variables to enable the /auth0 route');
}

app.use('/zoom', zoomRouter);

app.get('*', (req, res) => {
  res.sendFile('index.html', { root: path.resolve('apps/server/src/public') });
});

// Handle 404
app.use((req, res, next) => {
  const error = new Error('Not found');
  req.status = 404
  next(error)
})

// Handle errors (system browser only)
app.use((error: Error, req: express.Request, res: express.Response) => {
  res.status(req.status || 500)

  res.render('error', {
    title: 'Error',
    message: error.message,
    stack: error.stack,
  })
})

const server = http.createServer(app).listen(port, host, () => {
  console.log(`Zoom App is listening on http://${host}:${port}`)
});

const wss = new WebSocketServer({ server });

wss.on('connection', (ws, req) => {
  ws.on('message', async (data) => {
    const [type, payload] = data.toString().split(':');

    switch (type) {
      case "getCounter": {
        const counter = await getCounter(payload);

        ws.send(`counter:${counter}`);
        break;
      }
      case "incCounter": {
        const counter = await incCounter(payload);

        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(`counter:${counter}`);
          }
        });
        break;
      }
      case "decCounter": {
        const counter = await decCounter(payload);

        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(`counter:${counter}`);
          }
        });
        break;
      }
      default:
        break;
    }
  })
});

// TODO: Fix declaration merging for libraries

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    export interface Request {
      appUser?: {
        accessToken: string,
        refreshToken: string,
        expired_at: number
      };
      thirdPartyAccessToken?: string;
      status?: number;
    }
  }
}

declare module 'express-session' {
  export interface SessionData {
    user?: string;
    codeVerifier?: string;
    zoomRequestState?: string;
    state?: string;
    meetingUUID?: string;
    thirdPartyRequestState?: string;
  }
}
