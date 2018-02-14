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

### Run the unit tests in watch mode:
```bash
docker-compose run app test
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

### Enter the running local db container with psql
```
docker-compose exec db psql -U postgres -d complaint-manager
```
