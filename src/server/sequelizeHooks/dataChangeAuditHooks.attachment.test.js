import models from "../models";
import Attachment from "../../client/testUtilities/attachment";
import { DATA_CREATED, DATA_UPDATED } from "../../sharedUtilities/constants";
import Case from "../../client/testUtilities/case";

describe("dataChangeAuditHooks for attachment", () => {
  let attachment, attachmentOriginalAttributes, existingCase;
  beforeEach(async () => {
    const caseAttributes = new Case.Builder()
      .defaultCase()
      .withId(undefined)
      .withIncidentLocation(null);
    existingCase = await models.cases.create(caseAttributes, {
      auditUser: "me"
    });
    attachmentOriginalAttributes = new Attachment.Builder()
      .defaultAttachment()
      .withId(undefined)
      .withCaseId(existingCase.id);
    attachment = await models.attachment.create(attachmentOriginalAttributes, {
      auditUser: "someone"
    });
  });
  afterEach(async () => {
    await models.cases.truncate({ cascade: true });
    await models.data_change_audit.truncate();
  });

  describe("create attachment", () => {
    test("it saves basic attributes", async () => {
      const audits = await models.data_change_audit.findAll({
        where: { modelName: "attachment" }
      });
      expect(audits.length).toEqual(1);
      const audit = audits[0];

      expect(audit.modelId).toEqual(attachment.id);
      expect(audit.action).toEqual(DATA_CREATED);
      expect(audit.user).toEqual("someone");
      expect(audit.caseId).toEqual(existingCase.id);
    });

    test("it saves snapshot of object values", async () => {
      const audit = (await models.data_change_audit.findAll({
        where: { modelName: "attachment" }
      }))[0];

      const expectedSnapshot = {
        ...attachmentOriginalAttributes,
        createdAt: attachment.createdAt.toJSON(),
        updatedAt: attachment.createdAt.toJSON(),
        id: attachment.id
      };

      expect(audit.snapshot).toEqual(expectedSnapshot);
    });

    test("saves changes when creating new object", async () => {
      const audit = (await models.data_change_audit.findAll({
        where: { modelName: "attachment" }
      }))[0];

      const expectedChanges = {
        caseId: { new: attachment.caseId },
        description: { new: attachment.description },
        fileName: { new: attachment.fileName }
      };

      expect(audit.changes).toEqual(expectedChanges);
    });
  });

  describe("update attachment", () => {
    let audits, audit;
    beforeEach(async () => {
      await attachment.update(
        {
          fileName: "newfilename.jpg",
          description: "new description"
        },
        { auditUser: "someone else" }
      );
      audits = await models.data_change_audit.findAll({
        where: { modelName: "attachment", action: DATA_UPDATED }
      });
      audit = audits[0];
    });
    test("it creates a data change audit with basic attributes", async () => {
      expect(audits.length).toEqual(1);

      expect(audit.modelId).toEqual(attachment.id);
      expect(audit.user).toEqual("someone else");
      expect(audit.caseId).toEqual(existingCase.id);
    });

    test("it stores the changes", async () => {
      const expectedChanges = {
        description: {
          previous: attachmentOriginalAttributes.description,
          new: "new description"
        },
        fileName: {
          previous: attachmentOriginalAttributes.fileName,
          new: "newfilename.jpg"
        }
      };
      expect(audit.changes).toEqual(expectedChanges);
    });

    test("it stores the snapshot", async () => {
      await attachment.reload();
      const expectedSnapshot = {
        caseId: existingCase.id,
        fileName: "newfilename.jpg",
        description: "new description",
        createdAt: attachment.createdAt.toJSON(),
        updatedAt: attachment.updatedAt.toJSON(),
        id: attachment.id
      };
      expect(audit.snapshot).toEqual(expectedSnapshot);
    });
  });
});
