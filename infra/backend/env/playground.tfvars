heroku_email = "noipm.infrastructure@gmail.com"
team_name = "noipm"
app_name = "noipm-playground"

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
        }
    ]
}
POLICY
