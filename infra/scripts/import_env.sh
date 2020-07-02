#!/usr/bin/env bash

set -e

#terraform import module.webapp.heroku_addon.papertrail_addon papertrail-round-50268
#terraform import module.webapp.heroku_addon.postgres_addon postgresql-cubic-37375
#terraform import module.webapp.heroku_addon.redis_addon rediscloud-octagonal-44913
#terraform import module.webapp.heroku_app.app noipm-staging
#terraform import module.webapp.aws_s3_bucket.exports_bucket noipm-exports-staging
#terraform import module.webapp.aws_s3_bucket_policy.exports_bucket_policy noipm-exports-staging
#terraform import 'module.webapp.aws_s3_bucket_policy.bucket_policy["noipm-referral-letters-staging"]' noipm-referral-letters-staging
#terraform import 'module.webapp.aws_s3_bucket_policy.bucket_policy["noipm-complainant-letters-staging"]' noipm-complainant-letters-staging
terraform import 'module.webapp.aws_s3_bucket_policy.bucket_policy["noipm-staging"]' noipm-staging
terraform import 'module.webapp.aws_s3_bucket_policy.bucket_policy["nopd-officers-staging"]' nopd-officers-staging
terraform import 'module.webapp.aws_s3_bucket.env_bucket["nopd-officers-staging"]' nopd-officers-staging
terraform import 'module.webapp.aws_s3_bucket.env_bucket["noipm-complainant-letters-staging"]' noipm-complainant-letters-staging
terraform import 'module.webapp.aws_s3_bucket.env_bucket["noipm-referral-letters-staging"]' noipm-referral-letters-staging
terraform import 'module.webapp.aws_s3_bucket.env_bucket["noipm-staging"]' noipm-staging