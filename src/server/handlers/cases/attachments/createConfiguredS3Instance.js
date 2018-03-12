const AWS = require('aws-sdk')
const path = require('path');

const createConfiguredS3Instance = () => {
    const s3 = new AWS.S3()

    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
        s3.config.loadFromPath(path.join(__dirname, '../../../awsConfig.json'))
    }

    return s3
}

module.exports = createConfiguredS3Instance