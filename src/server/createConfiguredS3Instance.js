const {
  S3Client,
  CopyObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
  AbortMultipartUploadCommand
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { S3_GET_OBJECT } = require("../sharedUtilities/constants");
const config = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/serverConfig`);

const createConfiguredS3Instance = () => {
  const isLowerEnv = ["development", "test"].includes(process.env.NODE_ENV);
  const areCloudServicesDisabled =
    process.env.REACT_APP_USE_CLOUD_SERVICES == "false";

  let s3Settings;
  if (isLowerEnv && areCloudServicesDisabled) {
    console.log("Overriding AWS config for Localstack");
    s3Settings = {
      region: config.s3config.region,
      endpoint: "http://host.docker.internal:4566",
      forcePathStyle: true,
      tls: false,
      credentials: { accessKeyId: "test", secretAccessKey: "test" }
    };
  } else {
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

    s3Settings = {
      ...config.s3config,
      credentials: { accessKeyId, secretAccessKey }
    };
  }

  const s3 = new S3Client(s3Settings);

  return new S3Wrapper(s3);
};

class S3Wrapper {
  constructor(s3) {
    this.s3 = s3;
  }

  async _performS3Command(command, /* (err, response) => void */ callback) {
    let response;
    try {
      response = await this.s3.send(command);
    } catch (err) {
      if (callback) {
        callback(err);
      } else {
        throw err;
      }
    }

    if (callback) {
      callback(undefined, response);
    }

    return response;
  }

  async getObject({ Bucket, Key }, /* (err, response) => void */ callback) {
    return await this._performS3Command(
      new GetObjectCommand({ Bucket, Key }),
      callback
    );
  }

  async copyObject(
    { Bucket, CopySource, Key, ServerSideEncryption },
    /* (err, response) => void */ callback
  ) {
    return await this._performS3Command(
      new CopyObjectCommand({ Bucket, CopySource, Key, ServerSideEncryption }),
      callback
    );
  }

  async deleteObject({ Bucket, Key }, /* (err, response) => void */ callback) {
    return await this._performS3Command(
      new DeleteObjectCommand({ Bucket, Key }),
      callback
    );
  }

  async getSignedUrl(action, { Bucket, Key, Expires }) {
    if (action === S3_GET_OBJECT) {
      return await getSignedUrl(
        this.s3,
        new GetObjectCommand({ Bucket, Key }),
        { expiresIn: Expires }
      );
    } else {
      throw Error("this action isn't implemented for getSignedUrl");
    }
  }

  async _streamToBuffer(stream) {
    return new Promise((resolve, reject) => {
      const buffer = [];

      stream.on("data", chunk => buffer.push(chunk));
      stream.on("end", () => resolve(Buffer.concat(buffer)));
      stream.on("error", err => reject(err));
    });
  }

  async upload({ Bucket, Key, Body, ServerSideEncryption }) {
    const upload = await this.s3.send(
      new CreateMultipartUploadCommand({ Bucket, Key, ServerSideEncryption })
    );

    const finishUpload = async () => {
      const part = await this.s3.send(
        new UploadPartCommand({
          Body: Body.on ? await this._streamToBuffer(Body) : Body,
          Bucket,
          Key,
          PartNumber: "1",
          UploadId: upload.UploadId
        })
      );

      await this.s3.send(
        new CompleteMultipartUploadCommand({
          Bucket,
          MultipartUpload: {
            Parts: [
              {
                ETag: part.ETag,
                ChecksumCRC32: part.ChecksumCRC32,
                ChecksumSHA1: part.ChecksumSHA1,
                ChecksumSHA256: part.ChecksumSHA256,
                ChecksumCRC32C: part.ChecksumCRC32C,
                PartNumber: "1"
              }
            ]
          },
          Key,
          UploadId: upload.UploadId
        })
      );
    };

    return {
      abort: async () => {
        await this.s3.send(
          new AbortMultipartUploadCommand({
            Bucket,
            Key,
            UploadId: upload.UploadId
          })
        );
      },
      promise: finishUpload()
    };
  }

  async putObject(
    { Bucket, Key, Body, ServerSideEncryption },
    /* (err, response) => void */ callback
  ) {
    const result = await this._performS3Command(
      new PutObjectCommand({ Bucket, Key, Body, ServerSideEncryption }),
      callback
    );
    return { ...result, Bucket, Key };
  }

  async listObjectsV2(
    { Bucket, Prefix },
    /* (err, response) => void */ callback
  ) {
    return await this._performS3Command(
      new ListObjectsV2Command({ Bucket, Prefix }),
      callback
    );
  }
}

module.exports = createConfiguredS3Instance;
