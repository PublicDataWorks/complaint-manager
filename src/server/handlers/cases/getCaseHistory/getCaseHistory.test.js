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
import transformAuditToCaseHistory from "./transformAuditToCaseHistory";
import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import { createTestCaseWithoutCivilian } from "../../../testHelpers/modelMothers";
import ActionAudit from "../../../../client/testUtilities/ActionAudit";

describe("getCaseHistory", () => {
  let request, response, next, createdCase, caseId;

  beforeEach(async () => {
    createdCase = await createTestCaseWithoutCivilian();
    caseId = createdCase.id;

    request = httpMocks.createRequest({
      method: "GET",
      headers: {
        authorization: "Bearer token"
      },
      params: { caseId: caseId },
      nickname: "nickname"
    });
    response = httpMocks.createResponse();
    next = jest.fn();
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  test("should audit case history view", async () => {
    await getCaseHistory(request, response, next);

    const actionAudit = await models.action_audit.find({
      where: { caseId },
      returning: true
    });

    expect(actionAudit).toEqual(
      expect.objectContaining({
        user: "nickname",
        action: AUDIT_ACTION.DATA_ACCESSED,
        subject: AUDIT_SUBJECT.CASE_HISTORY,
        auditType: AUDIT_TYPE.DATA_ACCESS,
        caseId: createdCase.id
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

    const transformedAudits = transformAuditToCaseHistory([dataChangeAudit]);
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
          action: `${AUDIT_SUBJECT.REFERRAL_LETTER_PDF} ${
            AUDIT_ACTION.UPLOADED
          }`,
          details: AUDIT_UPLOAD_DETAILS.REFERRAL_LETTER_PDF,
          modelDescription: "",
          user: "nickname",
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
      .withSubject(AUDIT_SUBJECT.REFERRAL_LETTER_PDF)
      .withAuditType(AUDIT_TYPE.UPLOAD)
      .withUser("nickname");
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
    return await models.data_change_audit.create(dataChangeAuditAttributes);
  };
});
