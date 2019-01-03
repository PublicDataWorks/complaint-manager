import { cleanupDatabase } from "../../testHelpers/requestTestHelpers";
import { createCaseWithCivilian } from "../../testHelpers/modelMothers";
import removeCivilian from "./removeCivilian";
import {
  AUDIT_ACTION,
  AUDIT_SUBJECT,
  AUDIT_TYPE
} from "../../../sharedUtilities/constants";

const models = require("../../models/index");
const httpMocks = require("node-mocks-http");

describe("removeCivilian", function() {
  let existingCase;

  afterEach(async () => {
    await cleanupDatabase();
  });

  beforeEach(async () => {
    existingCase = await createCaseWithCivilian();
  });

  test("should audit case details access when civilian removed", async () => {
    const existingCivilians = await existingCase.getComplainantCivilians();
    const existingCivilian = existingCivilians[0];
    const request = httpMocks.createRequest({
      method: "DELETE",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      params: {
        caseId: existingCase.id,
        civilianId: existingCivilian.id
      },
      body: {
        address: {
          streetAddress: "123 Fleet Street",
          city: "Chicago"
        }
      },
      nickname: "TEST_USER_NICKNAME"
    });
    const response = httpMocks.createResponse();
    const next = jest.fn();

    await removeCivilian(request, response, next);

    const actionAudit = await models.action_audit.find({
      where: { caseId: existingCase.id }
    });

    expect(actionAudit).toEqual(
      expect.objectContaining({
        user: "TEST_USER_NICKNAME",
        subject: AUDIT_SUBJECT.CASE_DETAILS,
        auditType: AUDIT_TYPE.DATA_ACCESS,
        caseId: existingCase.id,
        action: AUDIT_ACTION.DATA_ACCESSED
      })
    );
  });
});
