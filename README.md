# Complaint Manager

## Local development setup

### Install docker:

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

## Set up google maps api key

* Log into Google with the noipm infrastructure google account from 1Password.
* Look up the api key for test environment at https://console.cloud.google.com/apis/credentials
* Set  a local environment variable of REACT_APP_GOOGLE_API_KEY with the value of the test api key.

### Set up local configuration for AWS S3

If you are a core team member:
* Log into AWS with root user (credentials are in the team 1Password)
* Create a new user for yourself in the development group

If you are a contributor, ask a core team member to setup AWS credentials for you.

Everyone:
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

### Worker Container
The application is  using a worker process to rub background jobs (exports).  The worker process processes jobs added to a queue (redis).  
When running locally, worker and server connect to a local Redis Container.  On other environments they connect to RedisCloud instance.  To connect to a redis cloud instance you must set the `REDISCLOUD_URL` environment variable.
When using RedisCloud plugin in Heroku, the `REDISCLOUD_URL` is automatically set.

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

### One off tasks

#### Adding migration
All one off task migrations live in `src/server/tasks`.
Create a `js` file in `src/server/tasks/migrations` where the name is `XXX_name.js` where `XXX` is the following number in the sequence.

You'll be able to run the one off task locally if you have the application running and running the command `docker-compose run app node ./src/server/tasks/migrate.js up`.

#### Docker Preferences
If Docker is killing your jest tests Exit 137, you might need to increase memory that Docker is using under “Advanced” in Docker preferences. Here are the defaults we have:
```
CPUs: 6,
Memory: 8.0 GB
Swap: 1.0 GB
```

### Known Warnings

We currently see the following warnings from pdfjs. This is a known issue where pdfjs is not compatible with webpack 4.2 
We use a workaround that copies the pdf.worker.js file to our build directory in a postbuild script.
Hopefully this will be fixed in a future release of pdfjs. 
More info here: https://github.com/wojtekmaj/react-pdf/wiki/Known-issues

```Critical dependency: require function is used in a way in which dependencies cannot be statically extracted```

There is a warning about duplicate props on the PhoneNumberField. These are actually two different props that have 
the same name, but different capitalization. inputProps and InputProps. They are needed.