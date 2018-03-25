// tslint:disable:ordered-imports
import 'reflect-metadata';
import * as bodyParser from 'body-parser';
import * as expressWinston from 'express-winston';
import { InversifyExpressServer } from 'inversify-express-utils';

import {
  Configuration,
  bindings,
} from './config';
import {
  logger,
  requestLogger,
} from './util';
import { Container } from 'inversify';

(async () => {

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

  });

  const serverInstance = server.build();

  serverInstance.listen(Configuration.PORT, () => {
    logger.info(`Server is running at http://localhost:${Configuration.PORT} in ${Configuration.ENVIRONMENT} mode`);
  });

})();
