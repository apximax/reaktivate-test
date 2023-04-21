## Pre requirements

You need to have Docker, docker-compose to run this project

## Installation

```bash
$ npm install
```

Simply copy `.env.sample` to `.env` and modify `.env` as you need

## Running the app

Use docker-compose to run the app

```bash
# build
$ docker-compose build

# run
$ docker-compose up -d
```
You can simply run just `docker-compose up -d`, it will build you the project before the first run

## Using the project

Send a `POST` request to `/login` route to create a session

The body should consist of JSON with `username` and `password` properties
with some `string` values.

Example

```bash
{
    "username": "test",
    "password": "test"
}
```

Send `GET` request to `/` route to interact with the app (imitate user's activity)
