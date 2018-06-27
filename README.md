# Complaint Manager

#### Build Status

[![CircleCI](https://circleci.com/gh/NOIPM/complaint-manager.svg?style=svg&circle-token=8fe915d6040eb1655d952ae1d9311648393350ab)](https://circleci.com/gh/NOIPM/complaint-manager)

## Local development setup

### Install docker

On Linux, run `apt-get install docker`.
On Mac or Windows you may [download it here](https://www.docker.com/products/docker).
Docker for Windows only supports Windows 10.
If you have an earlier version of Windows you'll need to install [docker toolbox](https://docs.docker.com/toolbox/toolbox_install_windows/) instead.

### To set up git hooks:

```bash
./scripts/setup-git-hooks.sh
```

The pre-push hook will execute when you run `git push`.
It will pull any remote changes, rebuild the app,
and run all tests before pushing.

### Set up local configuration for AWS S3

If you are a contributor, you can skip this step. You don't need AWS credentials unless you are working on attachments.

* Log into AWS with root user (credentials are in the team 1Password)
* Create a new user for yourself in the development group
* Save your login, access key ID and secret access key in your personal password manager
* Create a file named `awsConfig.json` in the the `src/server/` directory with your credentials:

```json
{
  "accessKeyId": "YOUR_ACCESS_KEY_ID",
  "secretAccessKey": "YOUR_SECRET_ACCESS_KEY",
  "region": "us-east-2"
}
```

## Local development tasks

### Run a Circleci job locally

```bash
circleci build --job <job name from .circleci/config.yml>
```

### Build the app:

```bash
docker-compose build
```

### Run the app locally in watch mode:

```bash
docker-compose up app
```

### Running tests

#### Running client side tests in watch mode:

Run all tests in `src/client` in parallel:

```bash
docker-compose run app yarn test:client
```

#### Running server side tests in watch mode:

Set up a test DB and run all tests in `src/server` sequentially:

```bash
docker-compose run app yarn test:server
```

#### Running all tests (no watch mode)

```bash
docker-compose run app yarn test:once
```

### Run the end-to-end tests locally:

#### First, ensure you have nightwatch installed:

```bash
npm install -g nightwatch
```

#### Then, bring up the app:

```bash
docker-compose up app
```

#### Then, set up environment variables for:

(Use your credentials for auth0 staging and a host of http://localhost:3000/)

    TEST_USER
    TEST_PASS
    HOST

#### Finally, run nightwatch tests:

```bash
yarn e2e
```

### Stop all running containers:

```bash
docker-compose down
```

### Update the end-to-end testing image:

```bash
docker login [enter your docker hub credentials]
docker build -t noipm/e2e e2e
docker push noipm/e2e
```

### Update the docker-heroku image:

First update the Docker file in the docker-heroku directory to set the heroku npm version you want to use.
Remember to update the circleci config file to point to the new tag you create.

```bash
docker login [enter your docker hub credentials]
docker build -t noipm/docker-heroku:[heroku-cli-version] docker-heroku
docker push noipm/docker-heroku:[heroku-cli-version]
```

### Enter the running local db container with psql

```
docker-compose exec db psql -U postgres -d complaint-manager
```
