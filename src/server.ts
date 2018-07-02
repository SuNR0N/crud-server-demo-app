// tslint:disable:ordered-imports
import 'reflect-metadata';
import * as bodyParser from 'body-parser';
import * as expressWinston from 'express-winston';
import { InversifyExpressServer } from 'inversify-express-utils';
import {
  serve,
  setup,
} from 'swagger-ui-express';
import { parse } from 'yamljs';

import {
  Configuration,
  bindings,
} from './config';
import {
  logger,
  requestLogger,
} from './util';
import { Container } from 'inversify';
import { Application } from 'express';
import { readFileSync } from 'fs';

export async function getServerInstance(): Promise<Application> {
  const container = new Container();
  await container.loadAsync(bindings);
  const server = new InversifyExpressServer(
    container,
    null,
    {
      rootPath: Configuration.ROOT_PATH,
    },
  );
  server.setConfig((app) => {
    app.use(bodyParser.urlencoded({
      extended: true,
    }));
    app.use(bodyParser.json());
    app.use(expressWinston.logger({
      winstonInstance: requestLogger,
    }));

    // Routes

    app.use(expressWinston.errorLogger({
      winstonInstance: logger,
    }));

    // Swagger
    const swaggerDocument = parse(readFileSync(Configuration.SWAGGER_SPEC_PATH, 'utf8'));
    app.use(Configuration.API_DOCS_PATH, serve, setup(swaggerDocument));

  });

  return server.build();
}
