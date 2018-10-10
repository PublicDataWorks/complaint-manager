import models from "../../../models";

const {
  AUDIT_ACTION,
  AUDIT_TYPE,
  AUDIT_SUBJECT
} = require("../../../../sharedUtilities/constants");

const createConfiguredS3Instance = require("../../../createConfiguredS3Instance");

jest.mock("../../../createConfiguredS3Instance");

createConfiguredS3Instance.mockImplementation(() => ({
  getSignedUrl: jest.fn(() => "authenticated file url")
}));

const generateExportDownloadUrl = require("./generateExportDownloadUrl");

describe("generate export download url", () => {
  test("create an authenticated download url", async done => {
    let fileName = "fileInS3.csv";

    const authenticatedUrl = await generateExportDownloadUrl(
      fileName,
      "someUser"
    );

    expect(authenticatedUrl).toEqual("authenticated file url");

    done();
  });

  test("create an audit for all cases export", async () => {
    let fileName = "fileInS3.csv";

    await generateExportDownloadUrl(fileName, "someUser");

    const actionAudit = await models.action_audit.find({
      where: {
        auditType: AUDIT_TYPE.EXPORT,
        action: AUDIT_ACTION.EXPORTED,
        subject: AUDIT_SUBJECT.ALL_CASE_INFORMATION
      }
    });

    expect(actionAudit.user).toEqual("someUser");
  });
});
