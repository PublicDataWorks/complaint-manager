terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
    }
    heroku = {
      source = "heroku/heroku"
    }
  }
  required_version = ">= 0.13"
}
