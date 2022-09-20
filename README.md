# Complaint Manager

The Complaint Manager is an open source tool meant to aid civilian police oversight agencies in generating complaint data. PDM is designed to be fully integrated into the workflows of these oversight agencies, enabling cities to enhance the capacity of citizens to hold public institutions accountable. [Read more here](https://publicdataworks.github.io/complaint-manager/business-content/introduction-to-police-data-manager.html#introduction-to-police-data-manager)

This README is aimed at getting new users set up to run Complaint Manager on their local machines. You will need the appropriate permissions for the app and its tests to run successfully.

If you are a city looking to adopt Complaint Manager as a tool for Complaint Intake, you can check out the guide to [setup a new city instance](https://publicdataworks.github.io/complaint-manager/technical-content/new-city-setup/new-city-setup-instructions.html)

If you are looking to contribute to this repo, take a look at [our contributor guidelines](https://publicdataworks.github.io/complaint-manager/technical-content/contributing.html).

## PLEASE NOTE

This is a public repository, so please do not include personally identifiable information for real people in commits to the repository

## Local Development Setup

### Platform Considerations

- Mac is the default developer platform for our team
- On any other platform (Linux / Windows) the code should compile and run, but this isn't something we've tested

### Install Heroku CLI (Optional)

If you plan to manually (or by local script) perform administrative tasks on Heroku deployments (including deploy them), you will need to install [the Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)

### Install Docker

- On Mac, you may [download it here](https://www.docker.com/products/docker)

### Set docker hosts for Postgres db and Redis

**Note:** You only need this if you are trying to run tests outside of the containers OR if you want to run DB migrations

- We depend on access to the local db container for running `server` tests in our IDE and also for running up/down migrations locally
- We depend on access to the local redis instance for debugging purposes and for running `worker` tests
- Using your text editor of choice, edit `/etc/hosts` file to add the following lines after the first localhost:
  ```
  127.0.0.1       db
  127.0.0.1       redis
  ```

### Docker Preferences

- To prevent Docker from running out of memory, you will need to adjust your Docker settings
- Under “Resources > Advanced” section in Docker preferences, change your default settings to the following:
  ```
  CPUs: 4,
  Memory: 6.0 GB
  Swap: 1.0 GB
  ```

### Set up Git Hooks

    ```bash
    ./scripts/setup-git-hooks.sh
    ```

- The pre-push hook will execute when you run `git push`. It will pull any remote changes, rebuild the app,
  run all tests, and run the security checks before pushing.

### Install local certificates

We use a tool called `mkcert` to manage self-signed certificates for the local environment.

Run these commands to install a signing certificate authority and certificates on your local machine:

```
brew install mkcert

# installs the local CA
mkcert -install

# make directory to store certs
cd <root of project>
mkdir .cert/

# generates the local certificates signed by local CA
mkcert -cert-file .cert/client.crt -key-file .cert/client.key localhost

# local certificiates for exporting audits
mkcert -cert-file data/server.test.pem.crt -key-file data/server.test.pem.key host.docker.internal

  - Navigate into the data folder and replace the contents in the server.test.pem file with the contents of the newly generated .key and .crt files. The .key should be at the top and the .crt on the bottom
  - Do a docker-compose down then a docker-compose up app for changes to take effect

# set CERT_DIR env variable
in .zshrc set the CERT_DIR environment variable to the directory in which the root cert lives (You can find this directory by running `mkcert -CAROOT`. Will look something like `/Users/<username>/Library/Application\ Support/mkcert`)

```

If you want to run using certs on Firefox also run `brew install nss`

If you run into issues like `ERROR: failed to read the CA key: open /Users/<username>/Library/Application Support/mkcert/rootCA-key.pem: permission denied`, then you can solve this using:

```
sudo chown <username> /Users/<username>/Library/Application\ Support/mkcert/rootCA-key.pem
```

### Set up Google Maps API Key

#### Core Team:

- Log into Google with the noipm infrastructure Google account from 1Password.
- Look up the Core Team API key for test environment at https://console.cloud.google.com/apis/credentials
- Set a local environment variable called REACT_APP_GOOGLE_API_KEY with this test key in either your ~/.profile or ~/.zshrc file depending on which one you use.

#### Contributor:

- You will receive a Contributor Test Key for Google Maps API from a Core Team member
- Set a local environment variable called REACT_APP_GOOGLE_API_KEY with this test key in either your ~/.profile or ~/.zshrc file.

### Set up Test Environment Variables

- Using your credentials for Auth0 ci, set local test environment variables called TEST_USER and TEST_PASS in either your ~/.profile or ~/.zshrc file.
  - Make sure your credentials were given DPM access.
  - Contributors should receive these from a Core Team member.

### Set up Local environment to point to AWS Cloud

- You only need this if you want to bypass LocalStack and test things using real AWS services like S3 and SecretsManager.

1. You must change `USE_CLOUD_SERVICES` and `REACT_APP_USE_CLOUD_SERVICES` from false to true in `docker-compose.yml`
2. You will need to setup `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` in your environment variables so PDM can connect to the AWS

### Install Local Dependencies

- Run `yarn install` to install dependencies on your machine (as opposed to in the docker container; you will need these for running unit tests outside the container e.g. your IDE, also Security Checks will run against your locally installed dependencies)

## Local Development Tasks

### Log Into Docker:

- Log into Docker using credentials provided by Core Team

`docker login`

### Build the app:

    ```bash
    ./scripts/docker-compose-build.sh
    ```

- You should not need to rebuild very often
  - Whenever a new package is added, rebuild

### Run the app locally in watch mode:

    ```bash
    docker compose up app
    ```

- Wait for the backend and frontend to initialize
  - Healthy console outputs for backend
  ```
  Application is listening on port 1234
  Please visit http://localhost:1234
  ```
  - Healthy console outputs for frontend
  ```
  Compiled with warnings.
  ```
- Navigate to `https://localhost`.

### Stop and remove all running containers:

    ```bash
    docker compose down
    ```

### But what actually happens when you're running locally?

It's all well and good to run these commands and watch Docker spin up with a lot of command line outputs, but what's actually happening?!

#### ./scripts/docker-compose-build.sh

docker-compose-build.sh builds the docker containers worker, app-e2e, and app so that they can then be spun up to run locally. The diagram below will show you the steps and indicate where those steps are configured

![docker-compose-build diagram](http://www.plantuml.com/plantuml/proxy?cache=no&src=https://raw.githubusercontent.com/PublicDataWorks/complaint-manager/master/docs/technical-content/plantuml/docker-compose-build.puml)

#### docker-compose up app

docker-compose up app runs the app container (which includes the client and server and pulls in the database, worker, and elasticsearch) so that you can use it locally. The diagram below will show you the steps it takes and indicate where those steps are configured

![docker-compose up app diagram](http://www.plantuml.com/plantuml/proxy?cache=no&src=https://raw.githubusercontent.com/PublicDataWorks/complaint-manager/master/docs/technical-content/plantuml/docker-compose-up.puml)

### Instance Files

By default, local builds will pull publicdataworks/instance-files-noipm:latest.

To create a new versioned instance-files-noipm image (i.e. publicdataworks/instance-files-noipm:1.0.0), execute the following commands from your private instance files repository (i.e. instance_files_noipm):

```
docker login $DOCKER_USERNAME $DOCKER_PASSWORD
docker build -t publicdataworks/instance-files-noipm:your-tag .
docker push publicdataworks/instance-files-noipm:your-tag
```

## The following need to be performed before pushing:

### Run security checks

    ```
    docker compose run --rm security-checks
    ```

### Running tests

#### Running client side tests in watch mode

- Run all tests in `src/client` in parallel:

  ```bash
  yarn test:client
  ```

  (client tests can be run in docker like the others, but since it doesn't require the test database it can be run outside of docker which is faster)

#### Running server side tests in watch mode:

- Set up a test DB and run all tests in `src/server` sequentially:

  ```bash
  docker-compose run --rm app yarn test:server
  ```

#### Running worker tests in watch mode:

- Set up a test DB and run all tests in `src/worker` sequentially:

  ```bash
  docker-compose run --rm app yarn test:worker
  ```

#### Hints for unit tests

- For when you want to run a specific test suite in the terminal for either client, server, or worker tests
  - Run the command for either client, worker, or server tests depending on the type of test you are working on
  - Once the database is prepared and the tests begin to run, press the "Enter" key and then the "p" key
  - Then start typing the filename where the desired test suite lives and once selected, press "Enter"
  - The test suite will rerun every time you make a change to the test file and any corresponding files

### Running pace tests locally:

- Run client tests (must come before server pact tests):

  ```bash
  yarn test:pact:client
  ```

- Run server tests (must come after client pact tests):
  ```bash
  docker compose run --rm app yarn test:pact:server
  ```

### Known Warnings

#### In the app

- We currently see the following warnings from pdfjs. This is a known issue where pdfjs is not compatible with webpack 4.2
  We use a workaround that copies the pdf.worker.js file to our build directory in a postbuild script.
  Hopefully this will be fixed in a future release of pdfjs.
  More info here: https://github.com/wojtekmaj/react-pdf/wiki/Known-issues

      ```Critical dependency: require function is used in a way in which dependencies cannot be statically extracted```

- There is a warning about duplicate props on the PhoneNumberField. These are actually two different props that have
  the same name, but different capitalization. inputProps and InputProps. They are needed.

#### In the tests

- You may see the following warning when running tests:

  ```bash
  Cannot find module 'pg-native' from 'client.js'

        However, Jest was able to find:
          './client.js'

        You might want to include a file extension in your import, or update your 'moduleFileExtensions', which is currently ['web.js', 'js', 'web.ts', 'ts', 'web.tsx', 'tsx', 'json', 'web.jsx', 'jsx', 'node'].

        See https://jestjs.io/docs/en/configuration#modulefileextensions-array-string
  ```

- You may ignore this warning; the tests will still pass.
