#!/usr/bin/env bash

set -e

terraform state mv aws_iam_policy.env_policy module.webapp.aws_iam_policy.env_policy
terraform state mv aws_iam_policy_attachment.attach_policy module.webapp.aws_iam_policy_attachment.attach_policy
terraform state mv heroku_addon.papertrail_addon module.webapp.heroku_addon.papertrail_addon
terraform state mv heroku_addon.postgres_addon module.webapp.heroku_addon.postgres_addon
terraform state mv heroku_addon.redis_addon module.webapp.heroku_addon.redis_addon
terraform state mv heroku_app.app module.webapp.heroku_app.app
terraform state mv aws_s3_bucket.exports_bucket module.webapp.aws_s3_bucket.exports_bucket
terraform state mv aws_s3_bucket_policy.exports_bucket_policy module.webapp.aws_s3_bucket_policy.exports_bucket_policy
terraform state mv 'aws_s3_bucket_policy.bucket_policy["noipm-referral-letters-ci"]' 'module.webapp.aws_s3_bucket_policy.bucket_policy["noipm-referral-letters-ci"]'
terraform state mv 'aws_s3_bucket_policy.bucket_policy["noipm-complainant-letters-ci"]' 'module.webapp.aws_s3_bucket_policy.bucket_policy["noipm-complainant-letters-ci"]'
terraform state mv 'aws_s3_bucket_policy.bucket_policy["noipm-ci"]' 'module.webapp.aws_s3_bucket_policy.bucket_policy["noipm-ci"]'
terraform state mv 'aws_s3_bucket_policy.bucket_policy["nopd-officers-ci"]' 'module.webapp.aws_s3_bucket_policy.bucket_policy["nopd-officers-ci"]'
terraform state mv 'aws_s3_bucket.env_bucket["nopd-officers-ci"]' 'module.webapp.aws_s3_bucket.env_bucket["nopd-officers-ci"]'
terraform state mv 'aws_s3_bucket.env_bucket["noipm-complainant-letters-ci"]' 'module.webapp.aws_s3_bucket.env_bucket["noipm-complainant-letters-ci"]'
terraform state mv 'aws_s3_bucket.env_bucket["noipm-referral-letters-ci"]' 'module.webapp.aws_s3_bucket.env_bucket["noipm-referral-letters-ci"]'
terraform state mv 'aws_s3_bucket.env_bucket["noipm-ci"]' 'module.webapp.aws_s3_bucket.env_bucket["noipm-ci"]'