import DataChangeAudit from "../../../../client/testUtilities/dataChangeAudit";
import {
  AUDIT_SUBJECT,
  AUDIT_TYPE,
  AUDIT_ACTION,
  AUDIT_UPLOAD_DETAILS
} from "../../../../sharedUtilities/constants";
import models from "../../../models";
import httpMocks from "node-mocks-http";
import getCaseHistory from "./getCaseHistory";
import transformAuditsToCaseHistory from "./transformAuditsToCaseHistory";
import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import { createTestCaseWithoutCivilian } from "../../../testHelpers/modelMothers";
import ActionAudit from "../../../../client/testUtilities/ActionAudit";
import mockFflipObject from "../../../testHelpers/mockFflipObject";

describe("getCaseHistory", () => {
  let request, response, next, createdCase, caseId;
  const testUser = "Grzegorz";

  beforeEach(async () => {
    createdCase = await createTestCaseWithoutCivilian();
    caseId = createdCase.id;

    request = httpMocks.createRequest({
      method: "GET",
      headers: {
        authorization: "Bearer token"
      },
      params: { caseId: caseId },
      nickname: testUser
    });
    response = httpMocks.createResponse();
    next = jest.fn();
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  // TODO remove following when removing newAuditFeature flag
  describe("newAuditFeature disabled", () => {
    beforeEach(() => {
      request.fflip = mockFflipObject({
        newAuditFeature: false
      });
    });

    test("should audit case history access", async () => {
      await getCaseHistory(request, response, next);

      const actionAudit = await models.action_audit.findOne({
        where: { caseId },
        returning: true
      });

      expect(actionAudit).toEqual(
        expect.objectContaining({
          user: testUser,
          action: AUDIT_ACTION.DATA_ACCESSED,
          subject: AUDIT_SUBJECT.CASE_HISTORY,
          auditType: AUDIT_TYPE.DATA_ACCESS,
          caseId: createdCase.id,
          auditDetails: expect.objectContaining({
            "Legacy Data Change Audit": [
              "Action",
              "Model Name",
              "Model Description",
              "Changes",
              "User",
              "Created At"
            ].sort()
          })
        })
      );
    });

    test("should return case audits in order of created at desc", async () => {
      await createDataChangeAudit(caseId, "Cases", "2017-01-31T13:00Z");
      await createDataChangeAudit(caseId, "Address", "2018-01-31T08:00Z");
      await createDataChangeAudit(caseId, "Civilians", "2018-01-31T06:00Z");

      await getCaseHistory(request, response, next);

      expect(response.statusCode).toEqual(200);
      expect(response._getData()).toEqual([
        expect.objectContaining({
          action: expect.stringContaining("Case")
        }),
        expect.objectContaining({
          action: expect.stringContaining("Address")
        }),
        expect.objectContaining({
          action: expect.stringContaining("Civilian")
        }),
        expect.objectContaining({
          action: expect.stringContaining("Case")
        })
      ]);
    });

    test("should not return case audits for other cases", async () => {
      await createDataChangeAudit(caseId + 1, "2017-01-31T13:00Z");

      await getCaseHistory(request, response, next);
      expect(response.statusCode).toEqual(200);
      expect(response._getData()).not.toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            action: "2017-01-31T13:00Z Updated"
          })
        ])
      );
    });

    test("should return the transformed case history needed for display", async () => {
      const dataChangeAudit = await createDataChangeAudit(
        caseId,
        "2017-01-31T13:00Z"
      );
      await getCaseHistory(request, response, next);

      const transformedAudits = transformAuditsToCaseHistory([dataChangeAudit]);
      expect(response.statusCode).toEqual(200);
      expect(response._getData()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            ...transformedAudits[0],
            id: expect.anything()
          })
        ])
      );
    });

    test("should return audit case uploads", async () => {
      await createUploadAudit(caseId, "2017-01-31T13:00Z");

      await getCaseHistory(request, response, next);
      expect(response.statusCode).toEqual(200);
      expect(response._getData()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            action: `${AUDIT_SUBJECT.FINAL_REFERRAL_LETTER_PDF} ${
              AUDIT_ACTION.UPLOADED
            }`,
            details: AUDIT_UPLOAD_DETAILS.REFERRAL_LETTER_PDF,
            modelDescription: "",
            user: testUser,
            id: expect.anything()
          })
        ])
      );
    });

    test("should not return data access audit other than upload", async () => {
      const isDataAccessAudit = caseHistoryAudit => {
        return caseHistoryAudit.action === AUDIT_ACTION.DATA_ACCESSED;
      };
      const dataAccessAttributes = new ActionAudit.Builder()
        .defaultActionAudit()
        .withId(undefined)
        .withCaseId(caseId);
      await models.action_audit.create(dataAccessAttributes);

      await getCaseHistory(request, response, next);

      expect(response.statusCode).toEqual(200);
      expect(response._getData().filter(isDataAccessAudit).length).toEqual(0);
    });

    test("should not return audit upload for other cases", async () => {
      const actionIsUploaded = caseHistoryEntry => {
        return caseHistoryEntry.action.includes(`${AUDIT_ACTION.UPLOADED}`);
      };
      const otherCase = await createTestCaseWithoutCivilian();
      await createUploadAudit(caseId);
      await createUploadAudit(otherCase.id);

      await getCaseHistory(request, response, next);

      expect(response.statusCode).toEqual(200);
      expect(response._getData().filter(actionIsUploaded).length).toEqual(1);
    });

    const createUploadAudit = async caseId => {
      const auditUploadAttributes = new ActionAudit.Builder()
        .defaultActionAudit()
        .withCaseId(caseId)
        .withId(undefined)
        .withAction(AUDIT_ACTION.UPLOADED)
        .withSubject(AUDIT_SUBJECT.FINAL_REFERRAL_LETTER_PDF)
        .withAuditType(AUDIT_TYPE.UPLOAD)
        .withUser(testUser);
      return await models.action_audit.create(auditUploadAttributes);
    };

    const createDataChangeAudit = async (
      caseId,
      modelName = "Case",
      createdAt
    ) => {
      const dataChangeAuditAttributes = new DataChangeAudit.Builder()
        .defaultDataChangeAudit()
        .withId(undefined)
        .withModelName(modelName)
        .withModelId(caseId)
        .withCaseId(caseId)
        .withAction(AUDIT_ACTION.DATA_UPDATED)
        .withChanges({ something: { previous: "old", new: "new" } })
        .withUser("bob")
        .withCreatedAt(createdAt);
      return await models.legacy_data_change_audit.create(
        dataChangeAuditAttributes
      );
    };
  });
  //TODO Finish rewriting the tests in the other describe and fit them in the format of the newAuditFeature case history
  describe("newAuditFeature enabled", () => {
    beforeEach(() => {
      request.fflip = mockFflipObject({ newAuditFeature: true });
    });

    test("should audit case history access", async () => {
      await getCaseHistory(request, response, next);

      const audit = await models.audit.findOne({
        where: { caseId, auditAction: AUDIT_ACTION.DATA_ACCESSED },
        include: [
          {
            model: models.data_access_audit,
            as: "dataAccessAudit",
            include: [
              { model: models.data_access_value, as: "dataAccessValues" }
            ]
          }
        ]
      });

      expect(audit).toEqual(
        expect.objectContaining({
          user: testUser,
          auditAction: AUDIT_ACTION.DATA_ACCESSED,
          caseId: createdCase.id,
          dataAccessAudit: expect.objectContaining({
            auditSubject: AUDIT_SUBJECT.CASE_HISTORY,
            dataAccessValues: expect.toIncludeSameMembers([
              expect.objectContaining({
                association: "audit",
                fields: expect.toIncludeSameMembers([
                  "auditAction",
                  "user",
                  "createdAt"
                ])
              }),
              expect.objectContaining({
                association: "dataChangeAudit",
                fields: expect.toIncludeSameMembers([
                  "modelName",
                  "modelDescription",
                  "changes"
                ])
              }),
              expect.objectContaining({
                association: "fileAudit",
                fields: expect.toIncludeSameMembers(["fileType", "fileName"])
              })
            ])
          })
        })
      );
    });

    test("should return case audits in order of created at desc", async () => {
      await createDataChangeAudit(caseId, "Cases", "2017-01-31T13:00Z");
      await createDataChangeAudit(caseId, "Address", "2018-01-31T08:00Z");
      await createDataChangeAudit(caseId, "Civilians", "2018-01-31T06:00Z");

      await getCaseHistory(request, response, next);

      expect(response.statusCode).toEqual(200);
      expect(response._getData()).toEqual([
        expect.objectContaining({
          action: expect.stringContaining("Case")
        }),
        expect.objectContaining({
          action: expect.stringContaining("Address")
        }),
        expect.objectContaining({
          action: expect.stringContaining("Civilian")
        }),
        expect.objectContaining({
          action: expect.stringContaining("Case")
        })
      ]);
    });

    test("should not return case audits for other cases", async () => {
      const anotherCase = await createTestCaseWithoutCivilian();
      await createDataChangeAudit(anotherCase.id, "2017-01-31T13:00Z");

      await getCaseHistory(request, response, next);
      expect(response.statusCode).toEqual(200);
      expect(response._getData()).not.toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            action: "2017-01-31T13:00Z Updated"
          })
        ])
      );
    });

    test("should return the transformed case history needed for display", async () => {
      const dataChangeAudit = await createDataChangeAudit(
        caseId,
        "2017-01-31T13:00Z"
      );
      await getCaseHistory(request, response, next);

      const transformedAudits = transformAuditsToCaseHistory([dataChangeAudit]);
      expect(response.statusCode).toEqual(200);
      expect(response._getData()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            ...transformedAudits[0],
            id: expect.anything()
          })
        ])
      );
    });

    test("should return audit case uploads", async () => {
      await createUploadAudit(caseId, "2017-01-31T13:00Z");

      await getCaseHistory(request, response, next);
      expect(response.statusCode).toEqual(200);
      expect(response._getData()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            action: `${AUDIT_SUBJECT.FINAL_REFERRAL_LETTER_PDF} ${
              AUDIT_ACTION.UPLOADED
            }`,
            details:
              "Filename: Test File\nFinal Referral Letter PDF finalized and uploaded to S3",
            modelDescription: "",
            user: testUser,
            id: expect.anything()
          })
        ])
      );
    });

    test("should not return data access audit other than upload", async () => {
      const isDataAccessAudit = caseHistoryAudit => {
        return caseHistoryAudit.action === AUDIT_ACTION.DATA_ACCESSED;
      };
      await models.audit.create(
        {
          user: testUser,
          auditAction: AUDIT_ACTION.DATA_ACCESSED,
          caseId: caseId,
          dataAccessAudit: {
            auditSubject: "test subject",
            dataAccessValues: [
              {
                association: "test association",
                fields: ["first field", "second field"]
              }
            ]
          }
        },
        {
          include: [
            {
              model: models.data_access_audit,
              as: "dataAccessAudit",
              include: [
                { model: models.data_access_value, as: "dataAccessValues" }
              ]
            }
          ]
        }
      );

      await getCaseHistory(request, response, next);

      expect(response.statusCode).toEqual(200);
      expect(response._getData().filter(isDataAccessAudit).length).toEqual(0);
    });

    test("should not return audit upload for other cases", async () => {
      const actionIsUploaded = caseHistoryEntry => {
        return caseHistoryEntry.action.includes(`${AUDIT_ACTION.UPLOADED}`);
      };
      const otherCase = await createTestCaseWithoutCivilian();
      await createUploadAudit(caseId);
      await createUploadAudit(otherCase.id);

      await getCaseHistory(request, response, next);

      expect(response.statusCode).toEqual(200);
      expect(response._getData().filter(actionIsUploaded).length).toEqual(1);
    });

    const createUploadAudit = async caseId => {
      return await models.audit.create(
        {
          user: testUser,
          auditAction: AUDIT_ACTION.UPLOADED,
          caseId: caseId,
          fileAudit: {
            fileType: AUDIT_SUBJECT.FINAL_REFERRAL_LETTER_PDF,
            fileName: "Test File"
          }
        },
        {
          include: [
            {
              model: models.file_audit,
              as: "fileAudit"
            }
          ]
        }
      );
    };

    const createDataChangeAudit = async (
      caseId,
      modelName = "Case",
      createdAt
    ) => {
      return await models.audit.create(
        {
          user: testUser,
          auditAction: AUDIT_ACTION.DATA_UPDATED,
          caseId: caseId,
          createdAt: createdAt,
          dataChangeAudit: {
            modelName: modelName,
            modelDescription: [{ tis: "a test description" }],
            modelId: caseId,
            snapshot: {},
            changes: { something: { previous: "old", new: "new" } }
          }
        },
        {
          include: [{ model: models.data_change_audit, as: "dataChangeAudit" }]
        }
      );
    };
  });
});
