import Case from "../../../../client/testUtilities/case";
import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import { getCaseWithAllAssociationsAndAuditDetails } from "../../getCaseHelpers";
import mockFflipObject from "../../../testHelpers/mockFflipObject";

const {
  AUDIT_ACTION,
  AUDIT_TYPE,
  AUDIT_SUBJECT
} = require("../../../../sharedUtilities/constants");
const getCase = require("./getCase");
const models = require("../../../models");
const httpMocks = require("node-mocks-http");

jest.mock("../../getCaseHelpers", () => ({
  getCaseWithAllAssociationsAndAuditDetails: jest.fn((caseId, transaction) => {
    return {
      caseDetails: { caseId: caseId },
      auditDetails: {
        cases: { attributes: ["mockDetails"], model: "cases" }
      }
    };
  })
}));

describe("getCase", () => {
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

  describe("newAuditFeature enabled", () => {
    let request;
    beforeEach(() => {
      request = httpMocks.createRequest({
        method: "GET",
        headers: {
          authorization: "Bearer token"
        },
        params: { caseId: existingCase.id },
        fflip: mockFflipObject({
          newAuditFeature: true
        }),
        nickname: "nickname"
      });
    });

    test("should audit when retrieving a case", async () => {
      const response = httpMocks.createResponse();
      const next = jest.fn();

      await getCase(request, response, next);

      const audit = await models.audit.findOne({
        where: { caseId: existingCase.id },
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

      expect(audit).toEqual(
        expect.objectContaining({
          auditAction: AUDIT_ACTION.DATA_ACCESSED,
          caseId: existingCase.id,
          user: request.nickname,
          dataAccessAudit: expect.objectContaining({
            auditSubject: AUDIT_SUBJECT.CASE_DETAILS,
            dataAccessValues: [
              expect.objectContaining({
                association: models.cases.name,
                fields: ["mockDetails"]
              })
            ]
          })
        })
      );
    });

    test("should not audit if an error occurs while retrieving case", async () => {
      getCaseWithAllAssociationsAndAuditDetails.mockImplementationOnce(() =>
        Promise.reject({ message: "mock error" })
      );

      const response = httpMocks.createResponse();
      const next = jest.fn();

      await getCase(request, response, next);

      const audits = await models.audit.findAll();
      expect(audits.length).toEqual(0);
    });

    test("should not create audit record when accessing nonexistent case", async () => {
      const invalidId = existingCase.id + 20;

      request.params.caseId = invalidId;

      const response = httpMocks.createResponse();
      const next = jest.fn();

      await getCase(request, response, next);

      const audits = await models.audit.findAll();
      expect(audits.length).toEqual(0);
    });
  });

  describe("newAuditFeature disabled", () => {
    let request;
    beforeEach(() => {
      request = httpMocks.createRequest({
        method: "GET",
        headers: {
          authorization: "Bearer token"
        },
        fflip: mockFflipObject({
          newAuditFeature: false
        }),
        params: { caseId: existingCase.id },
        nickname: "nickname"
      });
    });
    test("should audit when retrieving a case", async () => {
      const response = httpMocks.createResponse();
      const next = jest.fn();

      await getCase(request, response, next);

      const actionAudit = await models.action_audit.findOne({
        where: { caseId: existingCase.id },
        returning: true
      });

      expect(actionAudit.user).toEqual("nickname");
      expect(actionAudit.action).toEqual(AUDIT_ACTION.DATA_ACCESSED);
      expect(actionAudit.subject).toEqual(AUDIT_SUBJECT.CASE_DETAILS);
      expect(actionAudit.auditType).toEqual(AUDIT_TYPE.DATA_ACCESS);
      expect(actionAudit.caseId).toEqual(existingCase.id);
      expect(actionAudit.auditDetails).toEqual({ Case: ["Mock Details"] });
    });

    test("should not audit if an error occurs while retrieving case", async () => {
      getCaseWithAllAssociationsAndAuditDetails.mockImplementationOnce(() =>
        Promise.reject({ message: "mock error" })
      );

      const response = httpMocks.createResponse();
      const next = jest.fn();

      await getCase(request, response, next);

      const actionAudit = await models.action_audit.findAll();
      expect(actionAudit.length).toEqual(0);
    });

    test("should not create audit record when accessing nonexistent case", async () => {
      const invalidId = existingCase.id + 20;

      request.params.caseId = invalidId;

      const response = httpMocks.createResponse();
      const next = jest.fn();

      await getCase(request, response, next);

      const actionAudit = await models.action_audit.findAll();
      expect(actionAudit.length).toEqual(0);
    });
  });
});
