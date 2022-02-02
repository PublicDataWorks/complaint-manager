---
layout: default
title: Infrastructure Setup
parent: New City Setup
grand_parent: Technical Content
---
# Infrastructure Setup

## Before you begin

* Setup an AWS Account for the infrastructure described in [Developer Resources]()
* Setup a Heroku account as a PaaS for application deployment
* Setup a CircleCI account for your pipeline
* Setup a Google Maps API Key for address auto completion functionality
* Setup an Elastic Cloud instance for Search functionality

## Cost Expectations
*Pricing Last Updated: 03/01/2021*

Github 
* **($0.00/mo)** Maintaining an instance of PDM can be supported using Github's Free tier for organizations. 
* For more info see [Github Pricing](https://github.com/pricing)

Heroku 
* Production Environment - **($72.01/mo)** Hobby level Dynos with Standard level Data Services
* Heroku Lower Environments (2) - **($31.01/month per env)** Hobby levels for both Dynos and Data Services
* For more information see [Heroku Pricing](https://www.heroku.com/pricing)

AWS
* **(~$2.50/mo)** It's "pay-as-you-go" for various AWS services, but we average about this much.
* For more information see [AWS Pricing](https://aws.amazon.com/pricing/)

Circle CI
* **(~$50.00/mo)** We use the Linux plan with 1 paid and 1 free container
* For more information see [Circle CI Pricing](https://circleci.com/pricing/)

Docker
* **($15.00/mo)** Team Plan
* For more information see [Docker Pricing](https://www.docker.com/pricing)

Elastic Cloud
* **($16.00/mo)** Standard Plan
* For more information see [Elastic Cloud Pricing](https://www.elastic.co/pricing/)

Google Maps API
* **($0.00/mo)** We use the Geocoding and Places APIs but our usage is below the monthly $200 credit and we do not pay any costs.
* For more information see [Google Maps API Pricing](https://cloud.google.com/maps-platform/pricing)

**Total Per Month** - About $217.53

## Getting Started

### Uses
* The expectation is that any infrastructure changes that need to be done in any higher environments be done using Terraform scripts.
* This guide helps new contributors get setup with Terraform so they can make changes to their application infrastructure if/when the need arises.
* You can find their scripts under the `infra/envs/<env name>` and `infra/envs/common` directories.

### Setting Up Local Env for Provisioning
* Install Terraform [here](https://learn.hashicorp.com/tutorials/terraform/install-cli#install-terraform)
* Install AWS-CLI  [here](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2-mac.html)
* Navigate to project directory and cd into `infra/envs/<env name>`
* Run `aws configure --profile pdm-terraform`  to setup `pdm-terraform` profile
  * Grab the key ID and Secret Access key from your AWS account
  * Setup `us-east-1` as the default region
  * Leave the default format blank (hit enter)
* Confirm profile has been created with `aws configure list-profiles`. For more information on named profiles, look [here](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-profiles.html)
* Configure the [terraform backend](https://www.terraform.io/docs/language/settings/backends/index.html) to use AWS S3 e.g.
  ```
  terraform {
    backend "s3" {
      bucket = "pdm-terraform"
      region = "us-east-1"
      key    = "tfstate-demo"

      encrypt                 = true
      shared_credentials_file = "~/.aws/credentials"
      profile                 = "pdm-terraform"
    }
  }
  ```
  * bucket can be the name of the bucket you desire for your terraform state (we have gone with `pdm-terraform`)
  *  key can be the name of the state file that lives in the S3 bucket (we have gone with `tfsate-demo` so we can have various envs share the same bucket)
* Run `terraform init `

  **Note:** Ensure that terraform is using remote state in s3, stored in noipm-terraform bucket. If you are, you should see the following message after executing the command:
    ```
    Initializing the backend...

    Successfully configured the backend "s3"! Terraform will automatically use this backend unless the backend configuration changes.
    ```

### Customizing the Terraform Scripts

We have created a [Terraform module](https://www.terraform.io/docs/language/modules/index.html) for provisioning the web application and called it `webapp`. You can pass the variable parts of your supported infrasturcture as inputs into this module. Few of the inputs are described below:

| Input      | Description |
| ----------- | ----------- |
| heroku_email      | Email used for your Heroku account       |
| organization_name   | Name of your organization        |
| team_name   | Team name on Heroku account (if you are using teams)        |
| app_name   | App name on Heroku account (this will form your URL like `app_name.herokuapp.com`)        |
| env_name   | Name the env (e.g. dev or prod)        |
| env_usergroup_name   | User group to add in the environment user        |
| bucket_names   | Names of buckets to create on AWS S3        |
| api_target   | URL for your Heroku application (or Custom domain if you are using one)        |
| public_domain   | URL for your Custom domain if you are using one (otherwise just point to Heroku app URL)        |
| postgres_plan   | Names of the plan for Heroku [postgres add-on](https://elements.heroku.com/addons/heroku-postgresql) (e.g. `hobby-dev`, `hobby-basic` etc. )        |
| papertrail_plan   | Names of the plan for Heroku [papertrail add-on](https://elements.heroku.com/addons/papertrail) (e.g. `choklad`, `fixa`, etc. )        |
| env_policy   | A security policy for this environment created on AWS IAM        |

### Manual Steps before Provisioning
* Add Secrets to AWS Secrets Manager for respective environments (e.g. ci/Env/Config, staging/Env/Config):
  ```
  <env>_AUTH0_CLIENT_SECRET
  <env>_AWS_ACCESS_KEY_ID
  <env>_AWS_BUCKET_NAME
  <env>_AWS_SECRET_ACCESS_KEY
  LANG
  NEW_RELIC_APP_NAME
  NEW_RELIC_ENABLED
  NEW_RELIC_LICENSE_KEY
  NEW_RELIC_NO_CONFIG_FILE
  NODE_ENV
  HEROKU_API_TOKEN
  ```

### Steps to Provision 
**Individual Environment Resources**
* Navigate to project directory and cd into `infra/envs/<env name>`
* Run `terraform init`
* Run `terraform plan`
* Provide the Heroku API key for your Infrastructure account:
  * Go to https://dashboard.heroku.com/account
  * Scroll to **"API Key" Section-> Click "Reveal"**
* If everything looks right, then run `terraform apply`
* Follow previously listed steps to provide the Heroku API key
* Type "yes" to confirm provisioning the changes

**Common Environment Resources**
* Navigate to project directory and cd into `infra/envs/common`
* Run `terraform init`
* Run `terraform plan`
* You will be prompted to provide the API key for your Elasticsearch Cloud instance
* You will also be prompted to provide and organization name (i.e. noipm)
* If everything looks right, then run `terraform apply`
* Type "yes" to confirm provisioning the changes
* You will see two outputs (elasticsearch_username and elasticsearch_password). Save these values as ELASTIC_USERNAME and ELASTIC_PASSWORD in the Environment Variables section of your pipeline

    *Note: We have a [scheduled CircleCI job](https://circleci.com/docs/2.0/workflows/#nightly-example) which updates Elasticsearch indices every night for all higher environments*


### Manual Steps after Provisioning
* Create a scheduler job for restarting the Heroku Server Dynos
  * Why? Heroku automatically restarts all Dynos daily. In an effort to avoid restarts during business hours, we have created a scheduled job to manually kick off server restarts. Having this job run daily resets the timer on Heroku's automated restarts (thus allowing us to control the restart times).
  * How? 
    * Login to Heroku Dashboard
    * Click on `Heroku Scheduler` under add-ons
    * Click `Create Job`
    * Under Schedule, select "Every Day at" and choose a time which will not conflict with business hours
    * Under Command, paste the following API call: 
      * `curl -n -X DELETE https://api.heroku.com/apps/noipm-$NODE_ENV/dynos -H "Content-Type: application/json" -H "Accept: application/vnd.heroku+json; version=3" -H "Authorization: Bearer $HEROKU_API_TOKEN"`
    * Click `Save Job`
