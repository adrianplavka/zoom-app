import path from 'path';
import dotenv from 'dotenv';
import url from 'url';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.join(__dirname, `../.env${process.env.NODE_ENV ?? ""}`),
});

dotenv.config();

const envars = [
  'PORT',
  'SESSION_SECRET',
  'ZOOM_APP_CLIENT_URL',
  'ZOOM_APP_CLIENT_ID',
  'ZOOM_APP_CLIENT_SECRET',
  'ZOOM_APP_REDIRECT_URI',
  'ZOOM_HOST',
  'ZOOM_APP_OAUTH_STATE_SECRET',
  'REDIS_URL',
  'REDIS_ENCRYPTION_KEY',
];

envars.forEach((envar) => {
  if (!process.env[envar]) {
    console.log(path.join(__dirname, `../.env${process.env.NODE_ENV ?? ""}`))
    const error = new Error(`${envar} was not detected in environment ${process.env.NODE_ENV ?? ""}`);
    console.error(error);
    process.exit(1);
  }
});
