// tslint:disable:ordered-imports
import 'reflect-metadata';
import * as bodyParser from 'body-parser';
import * as expressWinston from 'express-winston';
import { InversifyExpressServer } from 'inversify-express-utils';

import {
  Configuration,
  container,
} from './config';
import {
  logger,
  requestLogger,
} from './util';

const server = new InversifyExpressServer(container);
server.setConfig((app) => {
  app.set(Configuration.Settings.PORT, process.env.PORT || Configuration.Defaults.PORT);

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

});

const serverInstance = server.build();

serverInstance.listen(serverInstance.get(Configuration.Settings.PORT), () => {
  const port = serverInstance.get(Configuration.Settings.PORT);
  const environment = serverInstance.get(Configuration.Settings.ENV);
  logger.info(`Server is running at http://localhost:${port} in ${environment} mode`);
});
