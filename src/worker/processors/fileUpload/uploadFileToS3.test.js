import createConfiguredS3Instance from "../../../server/createConfiguredS3Instance";

const timeKeeper = require("timekeeper");
const uploadFileToS3 = require("./uploadFileToS3");

jest.mock("../../../server/createConfiguredS3Instance");

describe("Upload files to S3", () => {
  test("upload text as a file to s3 bucket", () => {
    const s3 = { upload: jest.fn() };
    s3.upload.mockReturnValue({ promise: jest.fn() });

    const jobId = "123";
    const csvOutput = "text content to be uploaded";
    const exportFileName = "test file name";
    const fileType = "case_export";

    const date = new Date("Jan 01 2018 00:00:00 GMT-0600");
    timeKeeper.freeze(date);

    uploadFileToS3(jobId, csvOutput, exportFileName, fileType, s3);
    expect(s3.upload).toHaveBeenCalledWith({
      Bucket: "noipm-exports-test",
      Key: `${fileType}/${jobId}/Complaint_Manager_${exportFileName}_at_2018-01-01_00.00.00.CST.csv`,
      Body: csvOutput,
      ServerSideEncryption: "AES256"
    });

    timeKeeper.reset();
  });

  test("upload text as a file to s3 bucket testing default for s3", () => {
    const s3 = { upload: jest.fn() };
    s3.upload.mockReturnValue({ promise: jest.fn() });
    createConfiguredS3Instance.mockReturnValue(s3);

    const jobId = "123";
    const csvOutput = "text content to be uploaded";
    const exportFileName = "test file name";
    const fileType = "case_export";

    const date = new Date("Jan 01 2018 00:00:00 GMT-0600");
    timeKeeper.freeze(date);

    uploadFileToS3(jobId, csvOutput, exportFileName, fileType);
    expect(s3.upload).toHaveBeenCalledWith({
      Bucket: "noipm-exports-test",
      Key: `${fileType}/${jobId}/Complaint_Manager_${exportFileName}_at_2018-01-01_00.00.00.CST.csv`,
      Body: csvOutput,
      ServerSideEncryption: "AES256"
    });

    timeKeeper.reset();
  });
});
