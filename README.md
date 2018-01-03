# Complaint Manager

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

### Run the end-to-end tests:
```bash
docker-compose run e2e
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
