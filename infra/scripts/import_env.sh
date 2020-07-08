#!/usr/bin/env bash

set -e

ENV=production

# Update based on Heroku Addon Names
HEROKU_PAPERTRAIL_ADDON=papertrail-amorphous-37852
HEROKU_POSTGRES_ADDON=postgresql-shallow-90687
HEROKU_REDIS_ADDON=rediscloud-opaque-69763

# Heroku Infra
terraform import module.webapp.heroku_app.app noipm-${ENV}
terraform import module.webapp.heroku_addon.papertrail_addon ${HEROKU_PAPERTRAIL_ADDON}
terraform import module.webapp.heroku_addon.postgres_addon ${HEROKU_POSTGRES_ADDON}
terraform import module.webapp.heroku_addon.redis_addon ${HEROKU_REDIS_ADDON}

# AWS S3 Exports Bucket
terraform import module.webapp.aws_s3_bucket.exports_bucket noipm-exports-${ENV}
terraform import module.webapp.aws_s3_bucket_policy.exports_bucket_policy noipm-exports-${ENV}

# AWS S3 Buckets and their Policies
terraform import "module.webapp.aws_s3_bucket_policy.bucket_policy[\"noipm-referral-letters-${ENV}\"]" noipm-referral-letters-${ENV}
terraform import "module.webapp.aws_s3_bucket_policy.bucket_policy[\"noipm-complainant-letters-${ENV}\"]" noipm-complainant-letters-${ENV}
terraform import "module.webapp.aws_s3_bucket_policy.bucket_policy[\"noipm-${ENV}\"]" noipm-${ENV}
terraform import "module.webapp.aws_s3_bucket_policy.bucket_policy[\"nopd-officers-${ENV}\"]" nopd-officers-${ENV}
terraform import "module.webapp.aws_s3_bucket.env_bucket[\"nopd-officers-${ENV}\"]" nopd-officers-${ENV}
terraform import "module.webapp.aws_s3_bucket.env_bucket[\"noipm-complainant-letters-${ENV}\"]" noipm-complainant-letters-${ENV}
terraform import "module.webapp.aws_s3_bucket.env_bucket[\"noipm-referral-letters-${ENV}\"]" noipm-referral-letters-${ENV}
terraform import "module.webapp.aws_s3_bucket.env_bucket[\"noipm-${ENV}\"]" noipm-${ENV}

