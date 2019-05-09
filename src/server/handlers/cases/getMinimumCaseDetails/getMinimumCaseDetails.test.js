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
import mockFflipObject from "../../../testHelpers/mockFflipObject";

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
  describe("newAuditFeature toggle off", () => {
    test("audits the data access", async () => {
      request.fflip = mockFflipObject({
        newAuditFeature: false
      });

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
  describe("newAuditFeature toggle on", () => {
    test("audits the data access", async () => {
      request.fflip = mockFflipObject({
        newAuditFeature: true
      });

      await getMinimumCaseDetails(request, response, next);

      const dataAccessAudit = await models.audit.findOne({
        include: [
          {
            model: models.data_access_audit,
            as: "dataAccessAudit",
            include: [
              {
                model: models.data_access_value,
                as: "dataAccessValues"
              }
            ]
          }
        ]
      });

      expect(dataAccessAudit).toEqual(
        expect.objectContaining({
          auditAction: AUDIT_ACTION.DATA_ACCESSED,
          caseId: 205,
          user: request.nickname,
          dataAccessAudit: expect.objectContaining({
            auditSubject: AUDIT_SUBJECT.CASE_DETAILS,
            dataAccessValues: [
              expect.objectContaining({
                association: models.cases.name,
                fields: ["caseReference", "status"]
              })
            ]
          })
        })
      );
    });
  });
});
