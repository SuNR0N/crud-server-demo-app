# CRUD Server Demo Application

[![Build Status](https://travis-ci.org/SuNR0N/crud-server-demo-app.svg?branch=master)](https://travis-ci.org/SuNR0N/crud-server-demo-app)
[![Coverage Status](https://img.shields.io/coveralls/github/SuNR0N/crud-server-demo-app.svg)](https://coveralls.io/github/SuNR0N/crud-server-demo-app?branch=master)

Table of Contents
=================

* [Prerequisites](#prerequisites)
* [Install](#install)
* [Environment Variables](#environment-variables)
* [SQL](#sql)
* [Run](#run)
* [Test](#test)
* [API Documentation](#api-documentation)
* [Debug](#debug)
* [Docker Compose](#docker-compose)
* [Deployment](#deployment)
* [Database Migration](#database-migration)
* [OAuth](#oauth)

## Prerequisites

You need to have the following programs installed on your machine:
- [Node.js](https://nodejs.org/) (>= 8.11.3)
- [Yarn](https://yarnpkg.com/)
- [Docker](https://www.docker.com/)

You need to have a registered [OAuth App on GitHub](https://developer.github.com/apps/building-oauth-apps/) as you need to provide the `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` environment variables for the application (unless running it in _test_ mode) based on the unique values of your _GitHub_ application.

Build the custom PostgreSQL image with the SQL scripts:
```sh
docker build -t my-postgres -f docker/db/Dockerfile .
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

## Environment Variables

```sh
# Name of the database
DATABASE_DB=testdb

# Host on which the database is running on
DATABASE_HOST=localhost

# Password for the database
DATABASE_PASSWORD=pw

# Port on which the database is running on
DATABASE_PORT=5432

# Specifies whether the database connection requires SSL or not
DATABASE_SSL=false

# Connection string for the database which overrides other connection options if it is defined
DATABASE_URL=

# User for the database
DATABASE_USER=postgres

# The unique client id of your registered GitHub application
GITHUB_CLIENT_ID=

# The unique client secret of your registered GitHub application
GITHUB_CLIENT_SECRET=

# Environment in which the application is running 
NODE_ENV=development

# Port on which the Express server is running on
PORT=3000

# The secret which is being used to sign the session cookie to prevent tempering
SESSION_SECRET=535510n_53cr37
```

## SQL

The SQL scripts which are being used to create the database schema and to populate it with initial data can be found under the `sql` directory:

- _01_tables.sql_: Creates the _book_, _author_, _category_, _publisher_, _book_category_, _book_author_, _book_publisher_ and _users_ tables
- _02_author.sql_: Populates the _author_ table with authors
- _03_book.sql_: Populates the _book_ table with books
- _04_category.sql_: Populates the _category_ table with categories
- _05_publisher.sql_: Populates the _publisher_ table with publishers
- _06_book_author.sql_: Creates many-to-many relationships between books and authors
- _07_book_category.sql_: Creates many-to-many relationships between books and categories
- _08_book_publisher.sql_: Creates many-to-many relationships between books and publishers

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

# With watch mode
yarn test:watch
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

## Docker Compose

With the provided `docker-compose.yml` you can create a multi-container _Docker_ application in which the PostgreSQL database and the Node application will run in their own containers:

```sh
# Builds, (re)creates and starts the defined services
docker-compose up

# Stops the running services
docker-compose down
```

## Deployment

A successful _Travis_ build kicks off the deployment to _Heroku_ which is defined in the `.travis.yml`:

```yaml
deploy:
  provider: heroku
  app: $HEROKU_APP_NAME
  api_key: $HEROKU_AUTH_TOKEN
  on:
    repo: SuNR0N/crud-server-demo-app
```

The configuration takes 2 environment variables:
- _HEROKU_APP_NAME_: The name of your application in _Heroku_
- _HEROKU_AUTH_TOKEN_: Your auth token to _Heroku_ what you can get with `heroku auth:token` if you have the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) installed

_Heroku_ deploys the application based on the `heroku.yml` [build manifest](https://devcenter.heroku.com/articles/heroku-yml-build-manifest) file:

```yaml
setup:
  addons:
  - plan: heroku-postgresql:hobby-dev
    as: DATABASE
  config: 
    DATABASE_SSL: true
build:
  docker:
    web: Dockerfile
release:
  image: web
```

It specifies a _Heroku Postgres_ addon which will be our managed SQL database and it exposes the _DATABASE_URL_ by default for the available application containers (_dyno_) within the _Heroku_ application. Our dockerized Node application will run as a _dyno_ with process type _web_ therefore it will be able to receive HTTP traffic from the routers.

_Note_: As far as I'm aware no build context can be specified for the targeted _Dockerfile_ within the manifest file and it defaults to the folder where the file is located

## Database Migration

Once our application is deployed to _Heroku_ we need to do the database migration which can be done by running the migration script:

```sh
./scripts/migrate.sh heroku-app-name [sql-directory]
```

_Note_: This step depends on the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) therefore it has to be installed on your machine

## OAuth

_GitHub_ is the OAuth service provider for this project therefore you'll need a registered [OAuth App on GitHub](https://developer.github.com/apps/building-oauth-apps/) in order to run this application.

Once you log in with your _GitHub_ credentials and grant permissions to the app you'll be able to do the following actions:
- _Create_, _update_ and _delete_ authors
- _Create_, _update_ and _delete_ books
- _Create_, _update_ and _delete_ categories
- _Create_, _update_ and _delete_ publishers
- Get your own _GitHub_ profile information

Without logging in you can _list_ and _view_ all of the above mentioned entities in the system.

_Note_: You can turn off _GitHub_ authentication by running the application in _test_ mode: `NODE_ENV=test yarn start`