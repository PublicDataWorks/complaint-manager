variable "heroku_email" {
  description = "Email account used for provisioning against Heroku"
}

variable "heroku_api_key" {
  description = "API key for Heroku account associated with email"
}

variable "team_name" {
  description = "Name of the Heroku team under which the app should be provisioned"
}

variable "app_name" {
  description = "Name of the Heroku app to be provisioned"
}

variable "env_policy" {
  description = "Policy for buckets across the environment"
}

variable "env_policy_groups" {
  description = "Groups that will be associated with env policy"
}

variable "env_policy_roles" {
  description = "Roles that will be associated with env policy"
}

variable "env_name" {
  description = "Name of the environment"
}

variable "bucket_names" {
  description = "Names of the buckets in this env"
}

variable "api_target" {
  description = "Proxy URL for the HTTP API Gateway"
}

variable "public_domain" {
  description = "Custom Public Domain for Web App"
  default = ""
}

variable "postgres_plan" {
  description = "Heroku Postgres Plan Name"
}

variable "papertrail_plan" {
  description = "Papertrail Plan Name"
}

variable "database_connection_regex" {
  default = "://(?P<DATABASE_USERNAME>\\w+):(?P<DATABASE_PASS>\\w+)@(?P<DATABASE_HOST>[\\w-.]+):\\d+/(?P<DATABASE_NAME>\\w+)"
}