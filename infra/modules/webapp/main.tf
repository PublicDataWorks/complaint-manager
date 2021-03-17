provider "heroku" {
  version = "~> 2.0"
  email = var.heroku_email
  api_key = var.heroku_api_key
}

data "aws_secretsmanager_secret_version" "env_secrets" {
  secret_id = "${var.env_name}/Env/Config"
}

resource "heroku_app" "app" {
  name = var.app_name
  region = "us"
  organization {
    name = var.team_name
  }
  sensitive_config_vars = {
  for secret_key in keys(jsondecode(data.aws_secretsmanager_secret_version.env_secrets.secret_string)):
  secret_key => jsondecode(data.aws_secretsmanager_secret_version.env_secrets.secret_string)[secret_key]
  }
}

resource "heroku_addon" "scheduler_addon" {
  app = heroku_app.app.name
  plan = "scheduler:standard"
}

resource "heroku_addon" "redis_addon" {
  app = heroku_app.app.name
  plan = "rediscloud:30"
}

resource "heroku_addon" "postgres_addon" {
  app = heroku_app.app.name
  plan = "heroku-postgresql:${var.postgres_plan}"
}

resource "heroku_addon" "papertrail_addon" {
  app = heroku_app.app.name
  plan = "papertrail:${var.papertrail_plan}"
}

resource "heroku_app_config_association" "database_details" {
  app_id = heroku_app.app.id

  sensitive_vars = regex(var.database_connection_regex, heroku_app.app.all_config_vars["DATABASE_URL"])
}


resource "aws_s3_bucket" "env_bucket" {
  for_each = toset(var.bucket_names)

  bucket = each.value
  acl = "private"

  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        sse_algorithm = "AES256"
      }
    }
  }
}

resource "aws_s3_bucket" "exports_bucket" {
  bucket = "noipm-exports-${var.env_name}"
  acl = "private"

  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        sse_algorithm = "AES256"
      }
    }
  }

  lifecycle_rule {
    abort_incomplete_multipart_upload_days = 0
    enabled = true
    id = "Delete old exports"
    tags = {}

    expiration {
      days = 1
      expired_object_delete_marker = false
    }

    noncurrent_version_expiration {
      days = 1
    }
  }
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

resource "aws_s3_bucket_policy" "exports_bucket_policy" {
  bucket = aws_s3_bucket.exports_bucket.id

  policy = <<POLICY
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "DenyIncorrectEncryptionHeader",
            "Effect": "Deny",
            "Principal": "*",
            "Action": "s3:PutObject",
            "Resource": "arn:aws:s3:::${aws_s3_bucket.exports_bucket.id}/*",
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
            "Resource": "arn:aws:s3:::${aws_s3_bucket.exports_bucket.id}/*",
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
            "Resource": "arn:aws:s3:::${aws_s3_bucket.exports_bucket.id}/*",
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
  name = "noipm-${var.env_name}-bucket-access"
  description = "A policy to allow bucket listing and CRUD on bucket contents"
  policy = var.env_policy
}

resource "aws_iam_policy_attachment" "attach_policy" {
  name = "${var.env_name}-policy-group-attachment"
  groups = var.env_policy_groups
  roles = var.env_policy_roles
  policy_arn = aws_iam_policy.env_policy.arn
}

resource "aws_apigatewayv2_api" "api_gateway" {
  name          = "noipm-${var.env_name}-http-api"
  protocol_type = "HTTP"

  target = var.api_target

  cors_configuration {
    allow_origins = [var.api_target, var.public_domain]
    allow_methods = ["*"]
    allow_headers = ["*"]
    allow_credentials = true
    max_age = 7200
  }
}