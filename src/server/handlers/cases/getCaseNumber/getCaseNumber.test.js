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
import getCaseNumber from "./getCaseNumber";

describe("getCaseNumber", () => {
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
        id: existingCase.id
      },
      nickname: "nickname"
    });
    response = httpMocks.createResponse();
    next = jest.fn();
  });

  test("gets case number", async () => {
    await getCaseNumber(request, response, next);
    const responseBody = response._getData();
    expect(responseBody.caseNumber).toEqual("CC2017-0205");
  });

  test("audits the data access", async () => {
    await getCaseNumber(request, response, next);

    const dataAccessAudit = await models.action_audit.find();
    expect(dataAccessAudit.action).toEqual(AUDIT_ACTION.DATA_ACCESSED);
    expect(dataAccessAudit.auditType).toEqual(AUDIT_TYPE.DATA_ACCESS);
    expect(dataAccessAudit.user).toEqual("nickname");
    expect(dataAccessAudit.caseId).toEqual(existingCase.id);
    expect(dataAccessAudit.subject).toEqual(AUDIT_SUBJECT.CASE_NUMBER);
    expect(dataAccessAudit.subjectDetails).toEqual(["Case Number"]);
  });
});
