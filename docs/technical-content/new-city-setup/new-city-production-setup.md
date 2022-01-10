---
layout: default
title: Production Setup Instructions
parent: New City Setup
grand_parent: Technical Content
---

# *New City: Production Setup Instructions*

This documentation will walk you through how to set up and deploy the Police Data Monitor for production. 

## PRODUCTION CHECKLIST

- [X] Setup Local Environment
  
- [ ] Setup Heroku 

- [ ] Setup AWS  

- [ ] Setup Google Maps API Key

- [ ] Complete Infrastructure Setup

- [ ] [Optional] Dockerhub Setup

- [ ] Deploy New Version

## GETTING STARTED

### Setup Local Environment

Please make sure you have set up the local version of the app before proceeding. To do this, you may refer to [Local Setup Instruction](https://publicdataworks.github.io/police_data_manager/technical-content/new-city-setup/new-city-setup-instructions.html).

**Tip:** In the above documentation, we are assuming no changes are being made to the police-data-manager repository. However, in order to deploy a new city instance, we must make changes to police-data-manager and push them to a new github repository. Please follow the extra steps highlighted under the **Github** section to complete this step.
### Heroku account 
- Navigate to heroku.com/pricing and select the services which best matches your needs. Make sure to include (container, postgres and redis)
  - Will need to create a heroku account after checking out.
- After creating app, install both the Papertrail and Scheduler add-ons. 
- Go into the settings section and select the `Reveal config vars`, add the following variables with its associated value:
  - AWS_ACCESS_KEY_ID
  - AWS_BUCKET_NAME
  - AWS_SECRET_ACCESS_KEY
  - DATABASE_HOST
  - DATABASE_NAME
  - DATABASE_PASS
  - DATABASE_URL
  - DATABASE_USERNAME

### AWS Account
- Login as a federated user and go into the s3 services. 
- Create buckets with whatever name, or change the whole naing convention as you see fit as long as they're identifiable. Current buckets are as follows:
  - `name`-complainant-letters-demo 
  - `name`-demo
  - `name`-exports-demo
  - `name`-referral-letters-demo
  - `name`-seed-files
  - `name`-terraform 
  - `police department acronym`-officers-demo 
    - ex: gcpd-officers-demo
- Configuration for each buckets:
   - Under ***Object Ownership***, `ACLs disabled (recommended)` should be selected. 
   - `Block all public access` should be selected under the ***Block Public Access settings for this bucket***
   - ***Bucket Versioning*** should be `disable` 
   - Under ***Default encryption***, Server-side encrption should be Enabled
  - The ***Encryption key type*** should be `Amazon S3 key (SSE-S3)` 
  - Under Advanced settings, ***object Lock*** should be `disabled`.
- Navigate into the ***API gateway services*** and select `create api`
  - Under ***HTTP API*** you will select `Build` and enter your api name.
    - ex. `name`-http-api
  - Keep selecting next until you have finihsed creating the api. 
  - Upon completion, expand the ***Develop*** section located in the side menu, then select `CORS`
  - Select `Configure` and set the following configurations:
    - Access-Control-Allow-Origin: Add the Heroku API key
      - Go to https://dashboard.heroku.com/account
         Scroll to **"API Key" Section-> Click "Reveal"**
    - Access-Control-Allow-Methods: `*`
    - Access-Control-Max-Age: `7200`
    - Access-Control-Allow-Headers: `*`
    - Access-Control-Allow-Credentials: `yes`
  - After these are set, hit `save`.
  
### Google Maps API Key
  
- *using your organization gmail*, follow this [link](https://console.cloud.google.com/) and select create account, fill out the appropriate fields. 
- Under the navigation menu, `select APIs & Services` then `Library` to search and add the following api services:
  - Places API
  - Geocoding API	
  - Directions API					
  - Distance Matrix API					
  - Maps Elevation API					
  - Maps JavaScript API

### Infrastructure Setup

Follow this [link](https://publicdataworks.github.io/police_data_manager/technical-content/new-city-setup/infrastructure-setup.html) to set up the infrastructure needed to run the application.

### [Optional] Dockerhub setup
- Follow this [link](https://docs.docker.com/get-docker/) and follow the steps to get Docker that fits your machine specs. 
- Current settings that should be set:
  - CPUs: 4
  - Memory: 7.00 GB
  - Swap: 1 GB
  - Disk image size: 60 GB
- Make sure you login docker with the pdminfrastructure docker credentials in 1password. 
  
### Deploy New Version and Running App
- For deployment, on the heroku page, select the `Deploy` section and select the deployment method your prefer that heroku has provided and follow the instructions.
- To be able to run the app, on the Heroku page, select personal and select the button which says `Open app`.

## OTHER RESOURCES

### Development Resources

Follow this [link](https://publicdataworks.github.io/police_data_manager/technical-content/development-resources.html) to view the development resources for the application.

