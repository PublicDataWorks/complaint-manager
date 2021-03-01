terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
    }
    ec = {
      source  = "elastic/ec"
      version = "0.1.0-beta"
    }
  }
  required_version = ">= 0.13"
}
