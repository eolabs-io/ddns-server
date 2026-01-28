# DDNS Server

## Overview

This repository contains code for Dynamic DNS. It automatically updates name servers when the local IP changes.
Can be ran as is or in Docker.

## Installation

```bash
$ yarn install
```

### Configuration

File `.env.example` is an example of a configuration. It must be updated with your information.

For configuration the file that needs to be edited is `.env` file in the root of this repository. Copy `.env.example` file to `.env` and edit it.
For Docker Copy `.env.example` file to `ddns-server.env` and edit it.

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Docker

To run in a Docker container create a docker-compose.yaml file:

```yaml
services:
  ddns-server:
    image: ghcr.io/eolabs-io/ddns-server:latest
    container_name: ddns-server
    restart: unless-stopped
    ports:
      - 3000:3000
    env_file:
      - ddns-server.env
```

cd into directory and run `docker compose up -d`.

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Support

This is an MIT-licensed open source project.

## License

[MIT licensed](LICENSE).
