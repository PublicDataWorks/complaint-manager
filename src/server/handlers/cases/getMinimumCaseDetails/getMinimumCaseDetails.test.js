import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import Case from "../../../../client/testUtilities/case";
import {
  AUDIT_ACTION,
  AUDIT_SUBJECT,
  AUDIT_TYPE,
  CIVILIAN_INITIATED
} from "../../../../sharedUtilities/constants";
import models from "../../../models";
import httpMocks from "node-mocks-http";
import getMinimumCaseDetails from "./getMinimumCaseDetails";

describe("getMinimumCaseDetails", () => {
  let response, next, request, existingCase;

  afterEach(async () => {
    await cleanupDatabase();
  });

  beforeEach(async () => {
    const caseAttributes = new Case.Builder()
      .defaultCase()
      .withId(205)
      .withFirstContactDate("2017-12-25")
      .withComplaintType(CIVILIAN_INITIATED)
      .withComplainantCivilians([]);

    existingCase = await models.cases.create(caseAttributes, {
      include: [
        {
          model: models.civilian,
          as: "complainantCivilians",
          auditUser: "test"
        }
      ],
      auditUser: "test"
    });

    request = httpMocks.createRequest({
      method: "GET",
      headers: {
        authorization: "Bearer token"
      },
      params: {
        caseId: existingCase.id
      },
      nickname: "nickname"
    });
    response = httpMocks.createResponse();
    next = jest.fn();
  });

  test("gets case reference", async () => {
    await getMinimumCaseDetails(request, response, next);
    const responseBody = response._getData();
    expect(responseBody.caseReference).toEqual("CC2017-0001");
  });

  test("gets minimum case details for archived case", async () => {
    await existingCase.destroy({ auditUser: "test" });
    await getMinimumCaseDetails(request, response, next);
    const responseBody = response._getData();
    expect(responseBody.caseReference).toEqual("CC2017-0001");
  });

  test("audits the data access", async () => {
    await getMinimumCaseDetails(request, response, next);

    const dataAccessAudit = await models.action_audit.findOne();
    expect(dataAccessAudit.action).toEqual(AUDIT_ACTION.DATA_ACCESSED);
    expect(dataAccessAudit.auditType).toEqual(AUDIT_TYPE.DATA_ACCESS);
    expect(dataAccessAudit.user).toEqual("nickname");
    expect(dataAccessAudit.caseId).toEqual(existingCase.id);
    expect(dataAccessAudit.subject).toEqual(AUDIT_SUBJECT.CASE_DETAILS);
    expect(dataAccessAudit.auditDetails).toEqual({
      Case: ["Case Reference", "Status"]
    });
  });
});
