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
import { Container } from 'inversify';
import { Application } from 'express';
import { readFileSync } from 'fs';
import passport from 'passport';
import expressSession from 'express-session';

import {
  Configuration,
  bindings,
} from './config';
import {
  logger,
  requestLogger,
} from './util';
import { configurePassort } from './config/passport';
import { Types } from './constants';

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
  await configurePassort(passport, container.get(Types.UserService));
  server.setConfig((app) => {
    app.use(bodyParser.urlencoded({
      extended: true,
    }));
    app.use(bodyParser.json());
    app.use(expressWinston.logger({
      winstonInstance: requestLogger,
    }));
    app.use(expressSession({
      resave: true,
      saveUninitialized: true,
      secret: Configuration.SESSION_SECRET,
    }));
    app.use(passport.initialize());
    app.use(passport.session());

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
