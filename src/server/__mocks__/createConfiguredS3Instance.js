const createConfiguredS3InstanceMock = () => ({
  getObject: jest.fn((_, callback) => {
    let result = {
      ContentType: "image/bytes",
      ContentLength: 10,
      Body: {
        transformToString: jest.fn(() => "bytesbytesbytes")
      }
    };

    if (callback) {
      callback(undefined, result);
    }

    return Promise.resolve(result);
  }),
  copyObject: jest.fn(),
  deleteObject: jest.fn(),
  getSignedUrl: jest.fn(() => "url"),
  upload: jest.fn(() =>
    Promise.resolve({
      abort: jest.fn(),
      promise: Promise.resolve()
    })
  ),
  putObject: jest.fn(),
  listObjectsV2: jest.fn((_, callback) => {
    let result = {
      Contents: [
        {
          ETag: '"987asd6f9iuashdlkjhdf"',
          Key: "signatures/john_a_simms.png",
          LastModified: new Date(),
          Size: 11,
          StorageClass: "STANDARD"
        },
        {
          ETag: '"987asd6f9iuas23lkjhdf"',
          Key: "signatures/nina_ambroise.png",
          LastModified: new Date(),
          Size: 11,
          StorageClass: "STANDARD"
        },
        {
          ETag: '"987asd6jj3uashdlkjhdf"',
          Key: "signatures/Candy-1318242020000.png",
          LastModified: new Date(),
          Size: 11,
          StorageClass: "STANDARD"
        }
      ],
      IsTruncated: true,
      KeyCount: 3,
      MaxKeys: 3
    };

    if (callback) {
      callback(undefined, result);
    }

    return Promise.resolve(result);
  })
});

export default createConfiguredS3InstanceMock;
