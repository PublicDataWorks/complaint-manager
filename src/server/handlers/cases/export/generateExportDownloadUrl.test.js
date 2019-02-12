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

    await generateExportDownloadUrl(
      fileName,
      "someUser",
      AUDIT_SUBJECT.ALL_CASES
    );

    const actionAudit = await models.action_audit.findOne({
      where: {
        auditType: AUDIT_TYPE.EXPORT,
        action: AUDIT_ACTION.EXPORTED,
        subject: AUDIT_SUBJECT.ALL_CASES
      }
    });

    expect(actionAudit.user).toEqual("someUser");
  });

  test("create an audit for audit log export", async () => {
    let fileName = "fileInS3.csv";

    await generateExportDownloadUrl(
      fileName,
      "someUser",
      AUDIT_SUBJECT.AUDIT_LOG
    );

    const actionAudit = await models.action_audit.findOne({
      where: {
        auditType: AUDIT_TYPE.EXPORT,
        action: AUDIT_ACTION.EXPORTED,
        subject: AUDIT_SUBJECT.AUDIT_LOG
      }
    });

    expect(actionAudit.user).toEqual("someUser");
  });
});
