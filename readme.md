# Mern-Stack-Boilerplate

## Development Setup

First of all install docker from https://www.docker.com/products/docker-desktop/ and start mongodb container by running

```powershell
docker compose up -d
````

then

```powershell
npm install
```

then in `two separate terminals` run below two commands

```powershell
# start express server
npm run start:server

# start react client in development mode
npm run start:client
````

## Server Environment

below are the default values for environment variables

```dotenv
PORT=9000
DATABASE_CONNECTION_STRING=mongodb://127.0.0.1:27017/my_database
```