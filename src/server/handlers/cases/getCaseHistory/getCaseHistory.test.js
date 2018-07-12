import DataChangeAudit from "../../../../client/testUtilities/dataChangeAudit";
import {
  AUDIT_SUBJECT,
  AUDIT_TYPE,
  DATA_UPDATED,
  DATA_VIEWED
} from "../../../../sharedUtilities/constants";
import models from "../../../models";
import httpMocks from "node-mocks-http";
import getCaseHistory from "./getCaseHistory";
import transformAuditToCaseHistory from "./transformAuditToCaseHistory";
import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import { createCaseWithoutCivilian } from "../../../testHelpers/modelMothers";

describe("getCaseHistory", () => {
  let request, response, next, createdCase, caseId;

  beforeEach(async () => {
    createdCase = await createCaseWithoutCivilian();
    caseId = createdCase.id;

    request = httpMocks.createRequest({
      method: "GET",
      headers: {
        authorization: "Bearer token"
      },
      params: { id: caseId },
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
        action: DATA_VIEWED,
        subject: AUDIT_SUBJECT.CASE_HISTORY,
        auditType: AUDIT_TYPE.PAGE_VIEW,
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
      expect.objectContaining({ action: expect.stringContaining("Case") }),
      expect.objectContaining({ action: expect.stringContaining("Address") }),
      expect.objectContaining({ action: expect.stringContaining("Civilian") }),
      expect.objectContaining({ action: expect.stringContaining("Case") })
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
      .withAction(DATA_UPDATED)
      .withChanges({ something: { previous: "old", new: "new" } })
      .withUser("bob")
      .withCreatedAt(createdAt);
    return await models.data_change_audit.create(dataChangeAuditAttributes);
  };
});
