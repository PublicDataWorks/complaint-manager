variable "heroku_email" {
  description = "Email account used for provisioning against Heroku"
}

variable "heroku_api_key" {
  description = "API key for Heroku account associated with email"
}

variable "app_name" {
  description = "Name of the Heroku app to be provisioned"
}

provider "heroku" {
  version = "~> 2.0"
  email   = var.heroku_email
  api_key = var.heroku_api_key

}

resource "heroku_app" "app" {
  name   = "${var.app_name}"
  region = "us"
  organization {
    name = "noipm"
  }
}