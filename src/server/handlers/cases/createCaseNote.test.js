import { cleanupDatabase } from "../../testHelpers/requestTestHelpers";
import Case from "../../../client/testUtilities/case";
import models from "../../models";
import {
  AUDIT_ACTION,
  AUDIT_SUBJECT,
  AUDIT_TYPE,
  CASE_STATUS
} from "../../../sharedUtilities/constants";
import createCaseNote from "./createCaseNote";
import * as httpMocks from "node-mocks-http";
import moment from "moment";
import mockLodash from "lodash";

jest.mock("../getQueryAuditAccessDetails", () => ({
  generateAndAddAuditDetailsFromQuery: jest.fn(
    (existingDetails, queryOptions, topLevelModelName) => {
      existingDetails[mockLodash.camelCase(topLevelModelName)] = {
        attributes: ["mockDetails"],
        model: "mockModelName"
      };
    }
  ),
  addToExistingAuditDetails: jest.fn((existingDetails, detailsToAdd) => {
    existingDetails["mockAttribute"] = {
      attributes: ["mockDetails"],
      model: "mockModelName"
    };
  }),
  removeFromExistingAuditDetails: jest.fn()
}));

describe("createCaseNote", function() {
  let createdCase;

  afterEach(async () => {
    await cleanupDatabase();
  });

  beforeEach(async () => {
    const caseToCreate = new Case.Builder()
      .defaultCase()
      .withId(undefined)
      .withStatus(CASE_STATUS.INITIAL)
      .withComplainantCivilians([])
      .withAttachments([])
      .withAccusedOfficers([])
      .withIncidentLocation(undefined)
      .build();

    createdCase = await models.cases.create(caseToCreate, {
      auditUser: "someone"
    });
  });

  test("should audit case note accessed", async () => {
    const request = httpMocks.createRequest({
      method: "POST",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      body: { action: "some action", actionTakenAt: moment() },
      params: {
        caseId: createdCase.id
      },
      nickname: "TEST_USER_NICKNAME"
    });

    const response = httpMocks.createResponse();
    const next = jest.fn();
    await createCaseNote(request, response, next);

    const actionAudit = await models.action_audit.findAll({
      where: { caseId: createdCase.id }
    });

    expect(actionAudit).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          user: "TEST_USER_NICKNAME",
          auditType: AUDIT_TYPE.DATA_ACCESS,
          action: AUDIT_ACTION.DATA_ACCESSED,
          subject: AUDIT_SUBJECT.CASE_NOTES,
          caseId: createdCase.id
        })
      ])
    );
  });

  test("should audit case details accessed", async () => {
    const request = httpMocks.createRequest({
      method: "POST",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      body: { action: "some action", actionTakenAt: moment() },
      params: {
        caseId: createdCase.id
      },
      nickname: "TEST_USER_NICKNAME"
    });

    const response = httpMocks.createResponse();
    const next = jest.fn();
    await createCaseNote(request, response, next);

    const actionAudit = await models.action_audit.findAll({
      where: { caseId: createdCase.id }
    });

    expect(actionAudit).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          user: "TEST_USER_NICKNAME",
          auditType: AUDIT_TYPE.DATA_ACCESS,
          action: AUDIT_ACTION.DATA_ACCESSED,
          subject: AUDIT_SUBJECT.CASE_DETAILS,
          caseId: createdCase.id,
          auditDetails: { ["Mock Attribute"]: ["Mock Details"] }
        })
      ])
    );
  });
});
