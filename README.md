# Police Data Manager

This README is aimed at getting new users (Core Team and Contributors) set up to run Police Data Manager on their local machines. You will need the appropriate permissions for the app and its tests to run successfully.  

## Local Development Setup

### Platform Considerations

  * Mac is the default developer platform for our Core Team
  * On any other platform (Linux / Windows) the code show compile and run, but this isn't something we've tested

### Install Docker

  * On Mac, you may [download it here](https://www.docker.com/products/docker)

### Set docker hosts for Postgres db and Redis
  
  **Note:** You only need this if you are trying to run tests outside of the containers OR if you want to run DB migrations

  * We depend on access to the local db container for running tests in our IDE and also for running up/down migrations locally
  * We depend on access to the local redis instance for debugging purposes
  * Using your text editor of choice, edit ```/etc/hosts``` file to add the following lines after the first localhost:
    ```
    127.0.0.1       db
    127.0.0.1       redis
    ```

### Docker Preferences

  * To prevent Docker from running out of memory, you will need to adjust your Docker settings
  * Under “Resources > Advanced” section in Docker preferences, change your default settings to the following:
    ```
    CPUs: 4,
    Memory: 6.0 GB
    Swap: 1.0 GB
    ```

### Set up Git Hooks
    ```bash
    ./scripts/setup-git-hooks.sh
    ```

  * The pre-push hook will execute when you run `git push`. It will pull any remote changes, rebuild the app, 
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
  ```

If you want to run using certs on Firefox also run `brew install nss`

If you run into issues like `ERROR: failed to read the CA key: open /Users/<username>/Library/Application Support/mkcert/rootCA-key.pem: permission denied`, then you can solve this using:

```
sudo chown <username> /Users/<username>/Library/Application\ Support/mkcert/rootCA-key.pem
```

### Set up Google Maps API Key

#### Core Team:
  * Log into Google with the noipm infrastructure Google account from 1Password.
  * Look up the Core Team API key for test environment at https://console.cloud.google.com/apis/credentials
  * Set a local environment variable called REACT_APP_GOOGLE_API_KEY with this test key in either your ~/.profile or ~/.zshrc file depending on which one you use.

#### Contributor: 
  * You will receive a Contributor Test Key for Google Maps API from a Core Team member
  * Set a local environment variable called REACT_APP_GOOGLE_API_KEY with this test key in either your ~/.profile or ~/.zshrc file.
  
### Set up Test Environment Variables
  * Using your credentials for Auth0 ci, set local test environment variables called TEST_USER and TEST_PASS in either your ~/.profile or ~/.zshrc file.
    * Make sure your credentials were given DPM access.
    * Contributors should receive these from a Core Team member.

### Set up Local Configuration for AWS S3

Note: You only need to setup the AWS keys if you are using Authentication locally

#### Core Team:
  * Log into AWS from Okta
  * Create a new user for yourself in the developer group in IAM
    * You will need only programmatic access
    * No tags are required
    * Be sure to add yourself to the developer group

#### Contributor:
  * Ask a Core Team member to setup AWS credentials for you.

#### Everyone:
  * Save your login, access key ID and secret access key in your personal password manager
  * if you need aws locally
  Create a file named `awsConfig.json` in the the `src/server/` directory with your credentials:

    ```json
    {
      "accessKeyId": "YOUR_ACCESS_KEY_ID",
      "secretAccessKey": "YOUR_SECRET_ACCESS_KEY",
      "region": "us-east-1"
    }
    ```

### Install Local Dependencies
  * Run ```yarn install``` to install dependencies on your machine (as opposed to in the docker container; you will need these for running unit tests outside the container e.g. your IDE, also Security Checks will run against your locally installed dependencies)

## Local Development Tasks

### Log Into Docker:

  * Log into Docker using credentials provided by Core Team

   ```docker login```

### Build the app:
    ```bash
    ./scripts/docker-compose-build.sh
    ```
  * You should not need to rebuild very often
    * Whenever a new package is added, rebuild

### Run the app locally in watch mode:
    ```bash
    docker compose up app
    ```
  * Wait for the backend and frontend to initialize
    * Healthy console outputs for backend 
    ```
    Application is listening on port 1234
    Please visit http://localhost:1234
    ```
    * Healthy console outputs for frontend 
    ```
    Compiled with warnings.
    ```
  * Navigate to `https://localhost`.

### Stop and remove all running containers:
    ```bash
    docker compose down
    ```
    
### Instance Files
By default, local builds will pull noipm/instance-files:latest.

To create a new versioned instance-files image (i.e. noipm/instance-files:1.0.0), execute the following commands from your private instance files repository (i.e. instance_files_noipm):
```
docker login $DOCKER_USERNAME $DOCKER_PASSWORD
docker build -t noipm/instance-files:your-tag .
docker push noipm/instance-files:your-tag
```

## The following need to be performed before pushing:

### Run security checks
    ```
    docker compose run --rm security-checks
    ```

### Running tests

#### Running client side tests in watch mode

  * Run all tests in `src/client` in parallel:

    ```bash
    docker-compose run --rm app yarn test:client
    ```

#### Running server side tests in watch mode:

  * Set up a test DB and run all tests in `src/server` sequentially:

    ```bash
    docker-compose run --rm app yarn test:server
    ```

#### Running worker tests in watch mode:

  * Set up a test DB and run all tests in `src/worker` sequentially:

    ```bash
    docker-compose run --rm app yarn test:worker
    ```

#### Hints for unit tests

  * For running server, client, and worker tests all together (no watch mode)
    ```bash
    docker-compose run --rm app yarn test:once
    ```
  * For when you want to run a specific test suite in the terminal for either client, server, or worker tests
    * Run the command for either client, worker, or server tests depending on the type of test you are working on
    * Once the database is prepared and the tests begin to run, press the "Enter" key and then the "p" key
    * Then start typing the filename where the desired test suite lives and once selected, press "Enter"
    * The test suite will rerun every time you make a change to the test file and any corresponding files

### Running end-to-end tests locally:

  * Run nightwatch tests:

    ```bash
    yarn e2e
    ```

  * Troubleshooting e2e issues
    * If Test User/Pass or the Google Maps API key environment variables are not available to the e2e container
    
      * Remove the app-e2e container (so that it can be recreated)
      
      ```
      docker compose kill app-e2e
      docker compose rm app-e2e
      ```
      * Rerun e2e tests

### Known Warnings

#### In the app

  * We currently see the following warnings from pdfjs. This is a known issue where pdfjs is not compatible with webpack 4.2 
We use a workaround that copies the pdf.worker.js file to our build directory in a postbuild script.
Hopefully this will be fixed in a future release of pdfjs. 
More info here: https://github.com/wojtekmaj/react-pdf/wiki/Known-issues

    ```Critical dependency: require function is used in a way in which dependencies cannot be statically extracted```

  * There is a warning about duplicate props on the PhoneNumberField. These are actually two different props that have 
the same name, but different capitalization. inputProps and InputProps. They are needed.

#### In the tests

  * You may see the following warning when running tests:

    ```bash
    Cannot find module 'pg-native' from 'client.js'
    
          However, Jest was able to find:
            './client.js'
    
          You might want to include a file extension in your import, or update your 'moduleFileExtensions', which is currently ['web.js', 'js', 'web.ts', 'ts', 'web.tsx', 'tsx', 'json', 'web.jsx', 'jsx', 'node'].
    
          See https://jestjs.io/docs/en/configuration#modulefileextensions-array-string
     ```
 
  * You may ignore this warning; the tests will still pass.
