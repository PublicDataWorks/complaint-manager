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

variable "env_name" {
  description = "Name of the environment"
}

variable "bucket_names" {
  description = "Names of the buckets in this env"
}

variable "api_target" {
  description = "Proxy URL for the HTTP API Gateway"
}

variable "postgres_plan" {
  description = "Heroku Postgres Plan Name"
}

variable "papertrail_plan" {
  default = "Papertrail Plan Name"
}