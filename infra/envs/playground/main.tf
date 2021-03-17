terraform {
  backend "s3" {
    bucket = "noipm-terraform"
    region = "us-east-1"
    key    = "tfstate-playground"

    encrypt                 = true
    shared_credentials_file = "~/.aws/credentials"
    profile                 = "noipm-terraform"
  }
}

provider "aws" {
  version                 = "~> 2.0"
  region                  = "us-east-1"
  shared_credentials_file = "~/.aws/credentials"
  profile                 = "noipm-terraform"
}

variable "heroku_api_key" {
  description = "API key for Heroku account associated with email"
}

module "webapp" {
  source = "../../modules/webapp"

  heroku_api_key = var.heroku_api_key

  heroku_email = "noipm.infrastructure@gmail.com"

  team_name = "noipm"
  app_name  = "noipm-playground"

  env_name = "playground"

  bucket_names = [
    "noipm-playground",
    "nopd-officers-playground",
    "noipm-complainant-letters-playground",
    "noipm-referral-letters-playground"
  ]

  api_target = "https://noipm-playground.herokuapp.com"

  postgres_plan   = "hobby-dev"
  papertrail_plan = "choklad"

  env_policy = <<POLICY
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "AllowListingBucketPlayground",
            "Effect": "Allow",
            "Action": [
                "s3:ListBucket",
                "s3:GetBucketLocation"
            ],
            "Resource": "arn:aws:s3:::noipm-playground"
        },
        {
            "Sid": "AllowBucketContentCRUDPlayground",
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:GetObjectAcl",
                "s3:GetObject",
                "s3:DeleteObject",
                "s3:PutObjectAcl"
            ],
            "Resource": "arn:aws:s3:::noipm-playground/*"
        },
        {
            "Sid": "AllowListingBucketOfficers",
            "Effect": "Allow",
            "Action": [
                "s3:ListBucket",
                "s3:GetBucketLocation"
            ],
            "Resource": "arn:aws:s3:::nopd-officers-playground"
        },
        {
            "Sid": "AllowBucketContentCRUDOfficers",
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:GetObjectAcl",
                "s3:GetObject",
                "s3:DeleteObject",
                "s3:PutObjectAcl"
            ],
            "Resource": "arn:aws:s3:::nopd-officers-playground/*"
        },
        {
            "Sid": "AllowListingBucketExports",
            "Effect": "Allow",
            "Action": [
                "s3:ListBucket",
                "s3:GetBucketLocation"
            ],
            "Resource": "arn:aws:s3:::noipm-exports-playground"
        },
        {
            "Sid": "AllowBucketContentCRUDExports",
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:GetObjectAcl",
                "s3:GetObject",
                "s3:DeleteObject",
                "s3:PutObjectAcl"
            ],
            "Resource": "arn:aws:s3:::noipm-exports-playground/*"
        },
        {
            "Sid": "AllowListingBucketComplainantLetters",
            "Effect": "Allow",
            "Action": [
                "s3:ListBucket",
                "s3:GetBucketLocation"
            ],
            "Resource": "arn:aws:s3:::noipm-complainant-letters-playground"
        },
        {
            "Sid": "AllowBucketContentCRUDComplainantLetters",
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:GetObjectAcl",
                "s3:GetObject",
                "s3:DeleteObject",
                "s3:PutObjectAcl"
            ],
            "Resource": "arn:aws:s3:::noipm-complainant-letters-playground/*"
        },
        {
            "Sid": "AllowListingBucketReferralLetters",
            "Effect": "Allow",
            "Action": [
                "s3:ListBucket",
                "s3:GetBucketLocation"
            ],
            "Resource": "arn:aws:s3:::noipm-referral-letters-playground"
        },
        {
            "Sid": "AllowBucketContentCRUDReferralLetters",
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:GetObjectAcl",
                "s3:GetObject",
                "s3:DeleteObject",
                "s3:PutObjectAcl"
            ],
            "Resource": "arn:aws:s3:::noipm-referral-letters-playground/*"
        }
    ]
}
POLICY

  env_policy_groups = [
    "developer",
  "contributor"]

  env_policy_roles = [
    "federated-contributor"
  ]
}
