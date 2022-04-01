---
layout: default
title: FAQ
parent: Technical Content
---


# FAQ


## Useful Tools

**Q**. What tools will I need or will be useful for this project?

**A**. Necessary tools:

-   Docker: Follow the [README](https://github.com/PublicDataWorks/police_data_manager/blob/master/README.md) for instructions on downloading and running Docker. The `docker-compose` command allows us to chain and run multiple containers. 
**Note that anytime you make a change to `package.json`, you will have to rebuild using [`./scripts/docker-compose-build.sh`](https://github.com/PublicDataWorks/police_data_manager/blob/master/scripts/docker-compose-build.sh).** If you want to clear out your local database or suspect severe issues with the container itself, run `docker-compose down` to completely destroy the containers.
-   Postgres: SQL database for PDM. Will be automatically created, started, and migrated via Docker.
-   Git: Automatically pre-installed with Macs. Windows users will need to download it.
-   Yarn: Manages our packages. You may need to install it in order to run end-to-end tests, but otherwise, Docker will handle installing yarn packages.
-   pgAdmin: **[OPTIONAL]** Great tool for looking inside your Postgres database.

    To connect to the Police Data Manager local database:
    
        - Right click Server.
        - Select Create > Servers.
        - In the new modal, name the server anything you want. 
        - In the Connections tab: set "Host name/address" to "localhost"; "Maintenance database" should be set to "<name of database>" and "Username" should already be set to "postgres"; set "Password" to "password".
        - Save.
    
    -   JSON View Chrome extension: Makes any JSON pages (including feature toggles) pretty. Download the Chrome extension here: <https://chrome.google.com/webstore/detail/json-viewer/gbmdgpbipfallnflgajpaliibnhdgobh?hl=en-US>


## Local Environment

**Q**. Which environment variables will I need?

**A**. `REACT_APP_GOOGLE_API_KEY`: This key should be located in your `.profile`, `.zshrc`, or comparable local machine environment. It allows you to access address data from Google Maps. Some additional variables may be needed for cloud servics,
see [Conditionally Run Tests](https://publicdataworks.github.io/police_data_manager/technical-content/development-resources.html#testing) section for more information. 

**Q**. Which environment variables will I need to use instance-files within my local file system?

**A**. You will need to set `REACT_APP_REACT_APP_INSTANCE_FILES_DIR` to the absolute path of `/instance-files` within your local file system. You may retrieve this by running a `pwd` command from the instance-files directory within your cloned instance files repository (i.e. instance_files_your_organization_name). Once set, follow directions notated within the `docker-compose.yml`.

**Q**. I'm getting this error when I am on the website: `Failed to load resource: net::ERR_CERT_AUTHORITY_INVALID`

**A**. On Chrome, go to `chrome://flags/#allow-insecure-localhost` and enable the flag for "Allow invalid certificates for resources loaded from localhost.". Alternatively, on the latest Chrome, you can type `thisisunsafe` into the error page and bypass that error temporarily.

**Q**. I'm getting this error when trying to run up or down migrations: `getaddrinfo ENOTFOUND db db:5432`

**A**. Using your text editor of choice, edit `/etc/hosts` file to make it look like the following: 

    ##
    # Host Database
    #
    # localhost is used to configure the loopback interface
    # when the system is booting.  Do not change this entry.
    ##
    127.0.0.1       localhost
    127.0.0.1       db
    127.0.0.1       redis
    255.255.255.255 broadcasthost
    ::1             localhost

The reason that you need to edit this file is so that your computer knows what address to go to when the migrations use db or redis.

**Q**. I'm getting this error when trying to re-build the docker containers: `ERROR: Service '[...]' failed to build: [...] : no space left on device`.

**A**. Run Docker Prune using the command `docker system prune -a`.

**Q**. I'm getting a similar error as to the one above with my system running out of memory (especially after running the build script `./scripts/docker-compose-build.sh`)

**A**. Increase your memory to 6gb by going into your docker preferences and selecting the resources tab.

**Q**. How do I clear HTTPS redirect caching in Chrome?

**A**. When Chrome detects an HTTP to HTTPS redirect, Chrome will no longer go to the backend without doing the redirect from within the browser. When you need to test that the HTTPS redirect in our app is working correctly, you would need to clear this cache so that the client side application can be instructed by the server side to redirect.

-   Go to `chrome://net-internals`.
-   Navigate to the Domain Security Policy, which will be located at the bottom of the left-hand side navbar.
-   Scroll to the bottom of the page. In the "Delete domain security policies" section, type in the domain of the cache you wish to delete.
-   Press Delete.

*Note: To check that you have deleted the domain cache properly, you can scroll to the top to the Query HSTS/PKP Domain section. Type in the domain again, and press "Query". You have deleted the domain cache properly, if the result from the query is "Not found".*

## Auth0

**Q**. What is Auth0 and why do I need it?

**A**. Auth0 is a third-party service that provides authentication for the different environments in Police Data Manager.

## Lighthouse

**Q**. What is Lighthouse and why do I need it?

**A**. Lighthouse is a performance monitoring tool that provides a report of Police Data Manager page's performance at the time that it is ran. This can be used to identify the impact of particular code changes or ensure that performance thresholds are met during continuous integration processes.

**Q**. How do I access reports created by Lighthouse?

**A**. Navigate to the lighthouse job in the pipeline. Expand the "lhci autorun" tab. View the reports via html link for the corresponding page. 

**Q**. How do I configure Lighthouse?

**A**. Configurations can be made in `lighthouserc.json`. 

## End-To-End Testing with Nightwatch

**Q**. How do I run end-to-end testing?

**A**. Run `yarn e2e`. The tests are headless, so you won't see the Chrome driver or any test UI appear.

**Q**. How do I investigate a failed E2E test if there is no visible Chrome browser window?

**A**. Snapshots of failed tests are taken as if the browser were open. These can be located in `e2e/tests/policeDataManager/policeDataManagerUserJourney/`. Each snapshot comes labeled with a timestamp and the name of the test that failed. After a failure, no subsequent E2E tests will run.

**Q**. Help! My E2E test suite has failed. What do I do?

**A**. Run it again. End-to-end tests can be flaky, especially if you have just run `docker-compose up app`. If the same test repeatedly fails, then look for a snapshot (see above), and investigate. If you've enabled cloud services, you may also want to check that your local machine's variables are correctly set (see section on [Local Environment](https://publicdataworks.github.io/police_data_manager/technical-content/faq.html#local-environment)). If your environment variables are correctly set, then you may want to check that user priveleges are correctly set in Auth0 (i.e. DPM).


## Database Setup

**Q**. How do I squash the database?

**A**. As the project continues, the amount of migrations may expand to the point where squashing the database will improve, among other things, testing times, code legibility and database set up. At its core, squashing the database captures a snapshot of the current database schema generated by these migrations; you may then continue development as if this had been your original database, rather than one that had gradually developed out of the course of the project.

1.  Before you begin, dump the DB so it can be used for testing the squashing of the migrations after it is completed.

2.  In the migrations folder, look for the one with the title `"squash_migrations"`; it should be near the top of migrations, as it should be one of the oldest in the migrations list. Copy the contents from this file into a scratch file.

3.  Mount a volume on the DB container by adding an `./:tmp` to the db:volumes section of `docker-compose.yml`. This will make the the schema file you generate from the container available to your machine (restart the containers in order for the new volumes to take effect).

4.  Start a shell on the DB container using this command: docker-compose exec db bash

5.  Inside the container, generate the current schema as a dump by running `pg_dump -U postgres -d <name of database> -s > /tmp/yyyymmdd_schema.sql`; this will result in a new file being added to your current directory called (for example) `20191014_schema.sql`. Move this file into the schemas directory inside the migrations folder. Also remove the temporary mount in the `docker-compose.yml` file added in step 3.

6.  Update the `loadSchema.js` file in the scripts directory to point to the new schema file from step 5 by changing the value of const schemaFile.

7.  Delete the migrations you want to get rid of. It is recommended to keep the last few migrations so as to leave it possible to bring the database up and down and allow for work to continue on these most recent tables. Run tests, make a commit, push.

8.  Create a new migration for clearing out the database table `sequelize_meta` that tracks which of your migrations have run. Move the code from the scratch file generated in step 1 into a newly-generated migration ([Migrations FAQ](#migrations)). Alter the number of migrations you are saving (i.e. those migrations that would occur after the schema load is run) by changing the value of const numberOfMigrationsToKeep.

9.  Do a `docker-compose down` to clear your local database, then run the app using `docker-compose up app` to generate your database from the schema and any migrations you kept. In your `sequelize_meta` table, you should see all the migrations you kept, plus the new `squash_migration` you generated in step 8.

10. Make sure you test your squashing of migrations with DB dumps, before and after the process.

**Q**. How do I dump the database?

**A**. Follow these steps:

1.  Mount a volume on the DB container by adding an `./:tmp` to the `db:volumes` section of `docker-compose.yml`. This will make the dump file you generate from the container available to your machine. Run a `docker-compose down` and `docker-compose up app` to restart the containers in order for the new volumes to take effect.

2.  Start a shell on the DB container using this command: `docker-compose exec db bash`

3.  Run this command to dump the data inside the DB: `pg_dump -d <name of database> -U postgres -a -f /tmp/data.dump`

4.  This will result in a new file being added to your current directory called `data.dump`.

<a id="migrations">&nbsp;</a>

## Migrations

**Q**. In what order do migrations run?

**A**. Sequelize migrations run first and in the order they were created. These migrations create the database schema and are generated via the terminal (see below). Task migrations run afterwards in the order we give them and are created manually in the codebase. These migrate data into the schema.

**Q**. How do I generate a Sequelize (schema) migration from the terminal?

**A**. Run `yarn sequelize migration:generate --name name-of-your-migration`. This will automatically generate a file for you to create your up and down migration.

**Q**. How do I run up Sequelize migrations in my local environment from the terminal?

**A**. These are schema migrations. Run `NODE_ENV=development docker-compose run app yarn sequelize db:migrate` to run all migrations.

**Q**. How do I run down Sequelize migrations in my local environment from the terminal?

**A**. Run `NODE_ENV=development docker-compose run app yarn sequelize db:migrate:undo`. Unlike running the Sequelize up migration command, this will undo one migration at a time.

**Q**. How do I run down Sequelize migrations in higher environments?

**A**. If hosting on Heroku, use the "Run console" option in the respective environment of the Heroku Dashboard. Start a bash shell and then use the `yarn sequelize db:migrate:undo`, this will revert the last run migration.

**Q**. How do I create a seed migration in Sequelize via the terminal?

**A**. Run `yarn sequelize seed:generate --name seed-name` to automatically create the file in the seeder folder.  When you run `docker-compose up app`, the migrations and the seeds will run, automatically seeding the database. 

**Q**. How do I see migration transactions in development?

**A**. In `sequelize_config.js`, under "development" set logging to true. This should start logging the transactions in the command line when you run the app.

**Q**. How to force re-run migrations if docker isn't recognizing a change?

**A**. Delete the migration you want from the `sequelize_meta` table first, using pgAdmin.


## Seeders

**Q**. How do I add data to a seeder .csv file without disrupting existing data?

**A**. **WARNING: DO NOT UNDO THE SEEDER!** This will lead to reference ID integrity being SEVERELY compromised.

-   Locate the existing seeder file (i.e. an S3 bucket in AWS) you are updating and append your new data rows to the end, then replace
outdated .csv file with new file (which should retain the same filename)

For each environment you wish to re-seed data for:

-   Connect to the database for said environment and run the following command: `DELETE FROM sequelize_data WHERE name='<seeder-file-name>';`
-   Check that this seeder file name is no longer in the `sequelize_data` table.

Re-run seeder:

-   Local: Run a `docker-compose up app` command.
-   Higher Environments: Access the console for said environment on Heroku and run the following command: `yarn run sequelize db:seed:all`

*Note: Check that new data appears in the corresponding database and any expected changes in app UI appear*

## Elastic Search

**Q**. How can I re-run the index search creation in my local development environment?

**A**. You would have to run the `docker-compose run --rm app yarn setup:elasticsearch` script which can rebuild the search index for you locally. 

**Q**: How do I run test search queries? 

**A**: Run the following command in your terminal:

`npx babel-node ./scripts/search/query-index.js <search query>`

Q: How do I run test search queries in higher environments? 

A: Copy the elastic credentials from 1Password and use them to run the following command in your terminal:

`ELASTIC_USERNAME=<username> ELASTIC_PASSWORD=<password> NODE_ENV=<lower-cased-env-name> npx babel-node ./scripts/search/query-index.js <search query>`

## Serving the Client Side from the Server in Your Local Environment

**Q**. I want to serve the front end (client side) statically from the back end server in order to approximate the other environments in the development pipeline. How do I do that?

**A**. In [`docker-compose.yml`](https://github.com/PublicDataWorks/police_data_manager/blob/master/docker-compose.yml) under `services > app > build > volumes`, uncomment out the command `- ./build:/app/build` to mount the build file. Under `service > app > build > environments`, change `REACT_APP_ENV=development` to `REACT_APP_ENV=static_development`. You then need to build your front end using the command `REACT_APP_ENV=static_development yarn build` in your terminal. This will build your front end statically &#x2013; meaning you will lose hot loading capabilities; any subsequent changes in front end code will necessitate a rebuilding of your frontend or removing these changes and running front and back ends on separate ports. After the build simply run `docker-compose up app` to run the app from port 1234.


## Accessing the Local Database Without Using pgAdmin

**Q**. I want to enter the running local db container without pgAmin but with psql instead. How do I do that?

**A**. `docker-compose exec db psql -U postgres -d <name of database>`

**Q**. How do I access the local database logs?

**A**. `docker-compose logs db`
