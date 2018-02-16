import express from 'express';
import helmet from 'helmet';
import env from './env';
import {
  json as jsonParser,
  urlencoded as urlencodedParser,
  text as textParser,
  raw as rawParser,
} from 'body-parser';
import downloadController from './downloadController';

/**
 * Bootstraps the server
 * @param {Express} server The server app
 * @return {void}
 */
export default (async function makeServer() {
  try {
    const server = express();
    server.set('trust proxy', true);
    server.disable('x-powered-by');

    server.use(helmet());
    server.use(jsonParser());
    server.use(urlencodedParser({ extended: true }));
    server.use(textParser());
    server.use(rawParser());

    server.get('/', (req, res) => {
      res.send(
        `Download a specific file by ${env('APP_URL')}/lei2/{YYYYMMDD}/zip`
      );
    });

    server.get('/lei2/:date/zip', downloadController);

    server.use(function logErrors(err, req, res, next) {
      console.error(err.stack);
      next(err);
    });

    server.use(function handleErros(err, req, res, next) {
      res.status(500);
      res.json({
        message: 'Internal Server Error',
      });
    });

    return server;
  } catch (error) {
    throw error;
  }
});
