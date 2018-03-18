# CRUD Server Demo Application

## Initialize the Database

Build the custom PostgreSQL image with the SQL scripts:
```bash
docker build -t my-postgres .
```

Run the docker container:
```bash
docker run --name test-db --env-file .env -d my-postgres
```

Connect to the container via `psql`:
```bash
docker run -it --rm --link test-db:postgres my-postgres psql -h postgres -U postgres
```