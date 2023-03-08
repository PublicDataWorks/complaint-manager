import Case from "../../../../sharedTestHelpers/case";
import CaseStatus from "../../../../sharedTestHelpers/caseStatus";
import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import { getCaseWithAllAssociationsAndAuditDetails } from "../../getCaseHelpers";

const {
  AUDIT_ACTION,
  AUDIT_SUBJECT
} = require("../../../../sharedUtilities/constants");
const getCase = require("./getCase");
const models = require("../../../policeDataManager/models");
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
    await cleanupDatabase();
    await models.caseStatus.create(
      new CaseStatus.Builder().defaultCaseStatus().build(),
      { auditUser: "user" }
    );

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

  afterAll(async () => {
    await models.sequelize.close();
  });

  describe("auditing", () => {
    let request;
    beforeEach(() => {
      request = httpMocks.createRequest({
        method: "GET",
        headers: {
          authorization: "Bearer token"
        },
        params: { caseId: existingCase.id },
        nickname: "nickname"
      });
    });

    test("should audit when retrieving a case", async () => {
      const response = httpMocks.createResponse();
      const next = jest.fn();

      await getCase(request, response, next);

      const audit = await models.audit.findOne({
        where: {
          referenceId: existingCase.id,
          auditAction: AUDIT_ACTION.DATA_ACCESSED
        },
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
          referenceId: existingCase.id,
          managerType: "complaint",
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

    test("should not audit data access if an error occurs while retrieving case", async () => {
      getCaseWithAllAssociationsAndAuditDetails.mockImplementationOnce(() =>
        Promise.reject({ message: "mock error" })
      );

      const response = httpMocks.createResponse();
      const next = jest.fn();

      await getCase(request, response, next);

      const audits = await models.audit.findAll({
        where: {
          auditAction: AUDIT_ACTION.DATA_ACCESSED
        }
      });
      expect(audits.length).toEqual(0);
    });
  });
});
