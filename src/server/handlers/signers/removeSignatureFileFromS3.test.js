import createConfiguredS3Instance from "../../createConfiguredS3Instance";
import removeSignatureFileFromS3 from "./removeSignatureFileFromS3";
const config = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/serverConfig`);

jest.mock("../../createConfiguredS3Instance");

describe("Remove Signature File from S3", () => {
  test("Successfully remove file", async () => {
    const s3 = { deleteObject: jest.fn() };
    s3.deleteObject.mockImplementation((data, callback) =>
      callback(undefined, "DATA!")
    );
    createConfiguredS3Instance.mockReturnValue(s3);

    const response = await removeSignatureFileFromS3("file");

    expect(s3.deleteObject).toHaveBeenCalledWith(
      {
        Bucket: config[process.env.NODE_ENV].s3Bucket,
        Key: "signatures/file"
      },
      expect.anything()
    );
    expect(response).toEqual("DATA!");
  });

  test("Fail to remove file", async () => {
    const s3 = { deleteObject: jest.fn() };
    s3.deleteObject.mockImplementation((data, callback) => callback("ERROR!"));
    createConfiguredS3Instance.mockReturnValue(s3);

    try {
      await removeSignatureFileFromS3("file");
    } catch (err) {
      expect(err).toEqual("ERROR!");
    }

    expect(s3.deleteObject).toHaveBeenCalledWith(
      {
        Bucket: config[process.env.NODE_ENV].s3Bucket,
        Key: "signatures/file"
      },
      expect.anything()
    );
  });
});
