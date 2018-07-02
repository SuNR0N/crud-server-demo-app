# CRUD Server Demo Application

Table of Contents

* [Prerequisites](#prerequisites)
* [Install](#install)
* [Run](#run)
* [Test](#test)
* [API Documentation](#api-documentation)
* [Debug](#debug)

## Prerequisites

You need to have the following programs installed on your machine:
- [Node.js](https://nodejs.org/) (>= 8.11.3)
- [Yarn](https://yarnpkg.com/)
- [Docker](https://www.docker.com/)

Build the custom PostgreSQL image with the SQL scripts:
```sh
docker build -t my-postgres .
```

Run the docker container:
```sh
docker run --name test-db --env-file .env -p 5432:5432 -d my-postgres
```

_Note_:

You can connect to the container via `psql` through the following way:
```sh
docker run -it --rm --link test-db:postgres my-postgres psql -h postgres -U postgres
```

## Install

```sh
yarn
```

## Run

```sh
yarn start

# Run in development mode that watch for all code changes with an attached debugger
yarn dev

# Run in debug mode with an attached debugger
yarn debug
```

## Test

```sh
yarn test

# With coverage report
yarn test:coverage
```

## API Documentation

The API specification can be found at `swagger/swagger.yaml`.

Once you start the server the Swagger UI will serve the documentation at http://localhost:3000/api-docs

## Debug

Instructions for debugging in _VS Code_:

Method #1:

1. Select the _Debug_ menu on the sidebar
2. Select the _Application_ debug configuration
3. Click on _Start Debugging_
4. Put a breakpoint in the code

Method #2:

1. Start the application with `yarn dev` or `yarn debug`
2. Select the _Debug_ menu on the sidebar
3. Select the _Attach to Process_ debug configuration
4. Click on _Start Debugging_
5. Put a breakpoint in the code