import models from "../../complaintManager/models";
import getClassifications from "./getClassifications";
import httpMocks from "node-mocks-http";
import { cleanupDatabase } from "../../testHelpers/requestTestHelpers";

import auditDataAccess from "../audits/auditDataAccess";
import { AUDIT_SUBJECT } from "../../../sharedUtilities/constants";
import Case from "../../../client/complaintManager/testUtilities/case";

jest.mock("../audits/auditDataAccess");

describe("getClassifications", () => {
  let existingCase, request, response, next;

  afterEach(async () => {
    await cleanupDatabase();
  });

  beforeEach(async () => {
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
      AUDIT_SUBJECT.CASE_CLASSIFICATIONS,
      expectedAuditDetails,
      expect.anything()
    );
  });
});
