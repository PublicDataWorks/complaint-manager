import uploadLetterToS3 from "./uploadLetterToS3";
import config from "../../../../config/config";
import createConfiguredS3Instance from "../../../../createConfiguredS3Instance";
jest.mock("../../../../createConfiguredS3Instance", () => jest.fn());

describe("uploadLetterToS3", async () => {
  test("uploads given letter to s3", () => {
    const uploadMock = jest.fn(() => ({ promise: jest.fn() }));
    createConfiguredS3Instance.mockImplementation(() => ({
      upload: uploadMock
    }));

    const caseId = 5;
    const caseNumber = "CC-2018-0005";
    const pdfOutput = "Pdf for case 5";
    uploadLetterToS3(caseId, caseNumber, pdfOutput);

    expect(uploadMock).toHaveBeenCalledWith({
      Bucket: config[process.env.NODE_ENV].referralLettersBucket,
      Key: `${caseId}/ReferralLetter_${caseNumber}.pdf`,
      Body: pdfOutput,
      ServerSideEncryption: "AES256"
    });
  });
});
