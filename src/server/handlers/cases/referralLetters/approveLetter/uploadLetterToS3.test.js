import uploadLetterToS3 from "./uploadLetterToS3";
import config from "../../../../config/config";
import createConfiguredS3Instance from "../../../../createConfiguredS3Instance";
jest.mock("../../../../createConfiguredS3Instance", () => jest.fn());

describe("uploadLetterToS3", async () => {
  test("uploads given letter to s3, strips out non alphanumeric characters from name", () => {
    const uploadMock = jest.fn(() => ({ promise: jest.fn() }));
    createConfiguredS3Instance.mockImplementation(() => ({
      upload: uploadMock
    }));

    const caseId = 5;
    const firstContactDate = "2018-12-24";
    const caseNumber = "CC-2018-0005";
    const complainantLastName = "W'i@l*~s&o!n2";
    const pdfOutput = "Pdf for case 5";
    uploadLetterToS3(
      caseId,
      caseNumber,
      firstContactDate,
      complainantLastName,
      pdfOutput
    );

    expect(uploadMock).toHaveBeenCalledWith({
      Bucket: config[process.env.NODE_ENV].referralLettersBucket,
      Key: `${caseId}/12-24-2018_${caseNumber}_PIB_Referral_Wilson.pdf`,
      Body: pdfOutput,
      ServerSideEncryption: "AES256"
    });
  });
});
