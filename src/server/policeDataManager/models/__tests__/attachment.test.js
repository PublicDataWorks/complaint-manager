import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import { createTestCaseWithoutCivilian } from "../../../testHelpers/modelMothers";
import models from "../index";
import { CASE_STATUS } from "../../../../sharedUtilities/constants";

describe("attachment", () => {
  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  test("should update status when adding an attachment to a case", async () => {
    const initialCase = await createTestCaseWithoutCivilian();
    const attachmentValues = {
      caseId: initialCase.id,
      fileName: "test.pdf",
      description: "a description"
    };

    expect(initialCase.status).toEqual(CASE_STATUS.INITIAL);
    await models.attachment.create(attachmentValues, { auditUser: "someone" });

    await initialCase.reload({ include: [models.attachment] });

    const attachment = (await initialCase.getAttachments())[0];

    expect(attachment.fileName).toEqual("test.pdf");
    expect(initialCase.status).toEqual(CASE_STATUS.ACTIVE);
  });

  test("should NOT update status when adding an attachment to a case is unsuccessful", async () => {
    const initialCase = await createTestCaseWithoutCivilian();
    const attachmentValues = { caseId: initialCase.id, fileName: "test.pdf" };

    expect(initialCase.status).toEqual(CASE_STATUS.INITIAL);

    try {
      await models.attachment.create(attachmentValues, {
        auditUser: "someone"
      });
    } catch (error) {
      console.error(error);
    }

    await initialCase.reload({ include: [models.attachment] });

    const attachments = await initialCase.getAttachments();
    expect(attachments.length).toEqual(0);
    expect(initialCase.status).toEqual(CASE_STATUS.INITIAL);
  });
});
