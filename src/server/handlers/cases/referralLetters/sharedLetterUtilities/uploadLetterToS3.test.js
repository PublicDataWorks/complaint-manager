import uploadLetterToS3 from "./uploadLetterToS3";
import createConfiguredS3Instance from "../../../../createConfiguredS3Instance";

const config = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/serverConfig`);
jest.mock("../../../../createConfiguredS3Instance", () => jest.fn());

describe("uploadLetterToS3", () => {
  test("uploads given letter to s3, strips out non alphanumeric characters from name", () => {
    const uploadMock = jest.fn(() => ({ promise: jest.fn() }));
    createConfiguredS3Instance.mockImplementation(() => ({
      upload: uploadMock
    }));

    const filename = "filename";
    const pdfOutput = "Pdf for case 5";
    uploadLetterToS3(
      filename,
      pdfOutput,
      config[process.env.NODE_ENV].referralLettersBucket
    );

    expect(uploadMock).toHaveBeenCalledWith({
      Bucket: config[process.env.NODE_ENV].referralLettersBucket,
      Key: filename,
      Body: pdfOutput,
      ServerSideEncryption: "AES256"
    });
  });
});
