import removeSignatureFileFromS3 from "./removeSignatureFileFromS3";
const config = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/serverConfig`);

const mockS3 = {
  deleteObject: jest.fn()
};
jest.mock("../../createConfiguredS3Instance", () => {
  return jest.fn(() => mockS3);
});

describe("Remove Signature File from S3", () => {
  test("Successfully remove file", async () => {
    mockS3.deleteObject.mockImplementation(async () => "DATA!");

    const response = await removeSignatureFileFromS3("file");

    expect(mockS3.deleteObject).toHaveBeenCalledWith({
      Bucket: config[process.env.NODE_ENV].s3Bucket,
      Key: "signatures/file"
    });
    expect(response).toEqual("DATA!");
  });

  test("Fail to remove file", async () => {
    mockS3.deleteObject.mockImplementation(async () => {
      throw new Error("ERROR!");
    });

    try {
      await removeSignatureFileFromS3("file");
    } catch (err) {
      expect(err).toEqual(new Error("ERROR!"));
    }

    expect(mockS3.deleteObject).toHaveBeenCalledWith({
      Bucket: config[process.env.NODE_ENV].s3Bucket,
      Key: "signatures/file"
    });
  });
});
