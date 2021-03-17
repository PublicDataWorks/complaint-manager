terraform {
  backend "s3" {
    bucket = "noipm-terraform"
    region = "us-east-1"
    key    = "tfstate-ci"

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
  source         = "../../modules/webapp"
  heroku_api_key = var.heroku_api_key

  heroku_email = "noipm.infrastructure@gmail.com"
  team_name    = "noipm"
  app_name     = "noipm-ci"

  env_name = "ci"

  bucket_names = [
    "noipm-ci",
    "nopd-officers-ci",
    "noipm-complainant-letters-ci",
    "noipm-referral-letters-ci"
  ]

  api_target    = "https://noipm-ci.herokuapp.com"
  public_domain = "https://complaints-ci.nolaipm.gov"

  postgres_plan   = "hobby-basic"
  papertrail_plan = "fixa"

  env_policy = <<POLICY
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "AllowListingBucketCI",
            "Effect": "Allow",
            "Action": [
                "s3:ListBucket",
                "s3:GetBucketLocation"
            ],
            "Resource": "arn:aws:s3:::noipm-ci"
        },
        {
            "Sid": "AllowBucketContentCRUDCI",
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:GetObjectAcl",
                "s3:GetObject",
                "s3:DeleteObject",
                "s3:PutObjectAcl"
            ],
            "Resource": "arn:aws:s3:::noipm-ci/*"
        },
        {
            "Sid": "AllowListingBucketOfficers",
            "Effect": "Allow",
            "Action": [
                "s3:ListBucket",
                "s3:GetBucketLocation"
            ],
            "Resource": "arn:aws:s3:::nopd-officers-ci"
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
            "Resource": "arn:aws:s3:::nopd-officers-ci/*"
        },
        {
            "Sid": "AllowListingBucketExports",
            "Effect": "Allow",
            "Action": [
                "s3:ListBucket",
                "s3:GetBucketLocation"
            ],
            "Resource": "arn:aws:s3:::noipm-exports-ci"
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
            "Resource": "arn:aws:s3:::noipm-exports-ci/*"
        },
        {
            "Sid": "AllowListingBucketComplainantLetters",
            "Effect": "Allow",
            "Action": [
                "s3:ListBucket",
                "s3:GetBucketLocation"
            ],
            "Resource": "arn:aws:s3:::noipm-complainant-letters-ci"
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
            "Resource": "arn:aws:s3:::noipm-complainant-letters-ci/*"
        },
        {
            "Sid": "AllowListingBucketReferralLetters",
            "Effect": "Allow",
            "Action": [
                "s3:ListBucket",
                "s3:GetBucketLocation"
            ],
            "Resource": "arn:aws:s3:::noipm-referral-letters-ci"
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
            "Resource": "arn:aws:s3:::noipm-referral-letters-ci/*"
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
