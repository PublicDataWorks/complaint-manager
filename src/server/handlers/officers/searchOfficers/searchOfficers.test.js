import Case from "../../../../client/testUtilities/case";
import Officer from "../../../../client/testUtilities/Officer";
import models from "../../../models/index";

const { cleanupDatabase } = require("../../../testHelpers/requestTestHelpers");
const httpMocks = require("node-mocks-http");
const searchOfficers = require("./searchOfficers");
const {
  AUDIT_ACTION,
  AUDIT_TYPE,
  AUDIT_SUBJECT,
  DEFAULT_PAGINATION_LIMIT
} = require("../../../../sharedUtilities/constants");

describe("searchOfficers", function() {
  let existingCase;
  beforeEach(async () => {
    const caseToCreate = new Case.Builder()
      .defaultCase()
      .withId(undefined)
      .build();

    existingCase = await models.cases.create(caseToCreate, {
      auditUser: "someone"
    });
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  test("should audit when retrieving a case", async () => {
    const request = httpMocks.createRequest({
      method: "GET",
      headers: {
        authorization: "Bearer token"
      },
      query: {
        firstName: "Sal",
        caseId: existingCase.id,
        page: 1
      },
      nickname: "nickname"
    });

    const response = httpMocks.createResponse();
    const next = jest.fn();

    await searchOfficers(request, response, next);

    const actionAudit = await models.action_audit.findOne({
      where: { subject: AUDIT_SUBJECT.OFFICER_DATA },
      returning: true
    });

    expect(actionAudit.user).toEqual("nickname");
    expect(actionAudit.action).toEqual(AUDIT_ACTION.DATA_ACCESSED);
    expect(actionAudit.subject).toEqual(AUDIT_SUBJECT.OFFICER_DATA);
    expect(actionAudit.auditType).toEqual(AUDIT_TYPE.DATA_ACCESS);
    expect(actionAudit.caseId).toEqual(null);
  });

  test("should handle pagination", async () => {
    const totalOfficers = DEFAULT_PAGINATION_LIMIT + 1;
    const officers = [];
    for (let x = 1; x <= totalOfficers; x++) {
      officers.push(
        new Officer.Builder()
          .withOfficerNumber(x)
          .withFirstName("Sal")
          .withLastName("Foo")
          .build()
      );
    }
    officers[officers.length - 1].lastName = "LAST";

    await models.officer.bulkCreate(officers);
    const request = httpMocks.createRequest({
      method: "GET",
      headers: {
        authorization: "Bearer TOKEN"
      },
      query: {
        caseId: existingCase.id,
        firstName: "Sal",
        page: 2
      },
      nickname: "nickname"
    });

    const response = httpMocks.createResponse();
    await searchOfficers(request, response, jest.fn());

    expect(response._getData().rows.length).toEqual(1);
    expect(response._getData().rows).toEqual([
      expect.objectContaining({
        lastName: `LAST`
      })
    ]);
  });
});
