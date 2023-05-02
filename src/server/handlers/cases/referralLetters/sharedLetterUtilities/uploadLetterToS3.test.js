import uploadLetterToS3 from "./uploadLetterToS3";

const config = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/serverConfig`);

const mockS3 = {
  putObject: jest.fn()
};
jest.mock("../../../../createConfiguredS3Instance", () =>
  jest.fn(() => mockS3)
);

describe("uploadLetterToS3", () => {
  test("uploads given letter to s3, strips out non alphanumeric characters from name", () => {
    const filename = "filename";
    const pdfOutput = "Pdf for case 5";
    uploadLetterToS3(
      filename,
      pdfOutput,
      config[process.env.NODE_ENV].referralLettersBucket
    );

    expect(mockS3.putObject).toHaveBeenCalledWith({
      Bucket: config[process.env.NODE_ENV].referralLettersBucket,
      Key: filename,
      Body: pdfOutput,
      ServerSideEncryption: "AES256"
    });
  });
});
