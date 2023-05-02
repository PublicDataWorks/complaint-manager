import createConfiguredS3Instance from "../../../server/createConfiguredS3Instance";

const timeKeeper = require("timekeeper");
const uploadFileToS3 = require("./uploadFileToS3");

const mockS3 = {
  putObject: jest.fn()
};
jest.mock("../../../server/createConfiguredS3Instance", () =>
  jest.fn(() => mockS3)
);

describe("Upload files to S3", () => {
  test("upload text as a file to s3 bucket", () => {
    mockS3.putObject.mockReturnValue({ promise: jest.fn() });

    const jobId = "123";
    const csvOutput = "text content to be uploaded";
    const exportFileName = "test file name";
    const fileType = "case_export";

    const date = new Date("Jan 01 2018 00:00:00 GMT-0600");
    timeKeeper.freeze(date);

    uploadFileToS3(
      jobId,
      csvOutput,
      exportFileName,
      fileType,
      createConfiguredS3Instance()
    );
    expect(mockS3.putObject).toHaveBeenCalledWith({
      Bucket: "noipm-exports-test",
      Key: `${fileType}/${jobId}/Complaint_Manager_${exportFileName}_at_2018-01-01_00.00.00.CST.csv`,
      Body: csvOutput,
      ServerSideEncryption: "AES256"
    });

    timeKeeper.reset();
  });

  test("upload text as a file to s3 bucket testing default for s3", () => {
    mockS3.putObject.mockReturnValue({ promise: jest.fn() });

    const jobId = "123";
    const csvOutput = "text content to be uploaded";
    const exportFileName = "test file name";
    const fileType = "case_export";

    const date = new Date("Jan 01 2018 00:00:00 GMT-0600");
    timeKeeper.freeze(date);

    uploadFileToS3(jobId, csvOutput, exportFileName, fileType);
    expect(mockS3.putObject).toHaveBeenCalledWith({
      Bucket: "noipm-exports-test",
      Key: `${fileType}/${jobId}/Complaint_Manager_${exportFileName}_at_2018-01-01_00.00.00.CST.csv`,
      Body: csvOutput,
      ServerSideEncryption: "AES256"
    });

    timeKeeper.reset();
  });
});
