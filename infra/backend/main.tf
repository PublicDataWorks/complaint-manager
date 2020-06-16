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

variable "bucket_names" {
  description = "Names of the buckets in this env"
  default = [
    "noipm-playground",
    "nopd-officers-playground"
  ]
}

provider "heroku" {
  version = "~> 2.0"
  email   = var.heroku_email
  api_key = var.heroku_api_key
}

provider "aws" {
  version = "~> 2.0"
  region  = "us-east-1"
  shared_credentials_file = "~/.aws/credentials"
  profile                 = "noipm-terraform"
}

resource "heroku_app" "app" {
  name   = var.app_name
  region = "us"
  organization {
    name = var.team_name
  }
}

resource "heroku_addon" "redis_addon" {
  app  = heroku_app.app.name
  plan = "rediscloud:30"
}

resource "heroku_addon" "postgres_addon" {
  app  = heroku_app.app.name
  plan = "heroku-postgresql:hobby-dev"
}

resource "heroku_addon" "papertrail_addon" {
  app  = heroku_app.app.name
  plan = "papertrail:choklad"
}

resource "aws_s3_bucket" "env_bucket" {
  for_each = toset(var.bucket_names)

  bucket = each.value
  acl    = "private"
}

resource "aws_s3_bucket_policy" "bucket_policy" {
  for_each = toset(var.bucket_names)

  bucket = aws_s3_bucket.env_bucket[each.value].id

  policy = <<POLICY
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "DenyIncorrectEncryptionHeader",
            "Effect": "Deny",
            "Principal": "*",
            "Action": "s3:PutObject",
            "Resource": "arn:aws:s3:::${each.value}/*",
            "Condition": {
                "StringNotEquals": {
                    "s3:x-amz-server-side-encryption": "AES256"
                }
            }
        },
        {
            "Sid": "DenyUnEncryptedObjectUploads",
            "Effect": "Deny",
            "Principal": "*",
            "Action": "s3:PutObject",
            "Resource": "arn:aws:s3:::${each.value}/*",
            "Condition": {
                "Null": {
                    "s3:x-amz-server-side-encryption": "true"
                }
            }
        },
        {
            "Sid": "DenyUnSecureCommunications",
            "Effect": "Deny",
            "Principal": {
                "AWS": "*"
            },
            "Action": "s3:*",
            "Resource": "arn:aws:s3:::${each.value}/*",
            "Condition": {
                "Bool": {
                    "aws:SecureTransport": "false"
                }
            }
        }
    ]
}
POLICY
}

resource "aws_iam_policy" "env_policy" {
  name        = "noipm-playground-bucket-access"
  description = "A policy to allow bucket listing and CRUD on bucket contents"
  policy = var.env_policy
}
