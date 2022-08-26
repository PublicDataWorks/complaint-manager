import models from "../../policeDataManager/models";
import getClassifications from "./getClassifications";
import httpMocks from "node-mocks-http";
import { cleanupDatabase } from "../../testHelpers/requestTestHelpers";

import auditDataAccess from "../audits/auditDataAccess";
import {
  AUDIT_SUBJECT,
  MANAGER_TYPE
} from "../../../sharedUtilities/constants";
import Case from "../../../sharedTestHelpers/case";
import CaseStatus from "../../../sharedTestHelpers/caseStatus";

jest.mock("../audits/auditDataAccess");

describe("getClassifications", () => {
  let existingCase, request, response, next;

  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  beforeEach(async () => {
    await models.caseStatus.create(
      new CaseStatus.Builder().defaultCaseStatus().build(),
      { auditUser: "user" }
    );

    const caseAttributes = new Case.Builder().defaultCase().withId(undefined);
    existingCase = await models.cases.create(caseAttributes, {
      auditUser: "test"
    });

    request = httpMocks.createRequest({
      method: "GET",
      headers: {
        authorization: "Bearer token"
      },
      params: { caseId: existingCase.id },
      nickname: "bobjo"
    });

    response = httpMocks.createResponse();
    next = jest.fn();
  });

  test("should audit data access when getting classifications", async () => {
    const expectedAuditDetails = {
      classification: {
        attributes: expect.toIncludeSameMembers(["id", "name", "message"]),
        model: models.classification.name
      }
    };

    await getClassifications(request, response, next);

    expect(auditDataAccess).toHaveBeenCalledWith(
      request.nickname,
      existingCase.id,
      MANAGER_TYPE.COMPLAINT,
      AUDIT_SUBJECT.CASE_CLASSIFICATIONS,
      expectedAuditDetails,
      expect.anything()
    );
  });
});
