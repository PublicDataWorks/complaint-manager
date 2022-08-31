import { cleanupDatabase } from "../../../../testHelpers/requestTestHelpers";
import Case from "../../../../../sharedTestHelpers/case";
import models from "../../../../policeDataManager/models";
import {
  AUDIT_FILE_TYPE,
  MANAGER_TYPE
} from "../../../../../sharedUtilities/constants";
import httpMocks from "node-mocks-http";
import getReferralLetterPdf from "./getReferralLetterPdf";
import Boom from "boom";
import { BAD_REQUEST_ERRORS } from "../../../../../sharedUtilities/errorMessageConstants";
import auditDataAccess from "../../../audits/auditDataAccess";
import { seedStandardCaseStatuses } from "../../../../testHelpers/testSeeding";

jest.mock(
  "../generateLetterPdfBuffer",
  () => (caseId, includeSignature, transaction) => {
    return {
      pdfBuffer: `pdf for case ${caseId}`,
      auditDetails: {
        mockAssociation: {
          attributes: ["mockDetails"],
          model: "mockModelName"
        }
      }
    };
  }
);
jest.mock("../../../audits/auditDataAccess");

describe("Generate referral letter pdf", () => {
  let existingCase, request, response, next, statuses;

  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  beforeEach(async () => {
    statuses = await seedStandardCaseStatuses();

    const caseAttributes = new Case.Builder()
      .defaultCase()
      .withId(12070)
      .withFirstContactDate("2017-12-25");
    existingCase = await models.cases.create(caseAttributes, {
      auditUser: "test"
    });
    await existingCase.update(
      { currentStatusId: statuses.find(status => status.name === "Active").id },
      { auditUser: "test" }
    );

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

  describe("case in valid status", () => {
    beforeEach(async () => {
      await existingCase.update(
        {
          currentStatusId: statuses.find(
            status => status.name === "Letter in Progress"
          ).id
        },
        { auditUser: "test" }
      );
    });

    test("returns results full generated pdf response", async () => {
      await getReferralLetterPdf(request, response, next);
      expect(response._getData()).toEqual(`pdf for case ${existingCase.id}`);
    });

    describe("auditing", () => {
      test("audits the data access", async () => {
        await getReferralLetterPdf(request, response, next);

        const expectedAuditDetails = {
          mockAssociation: {
            attributes: ["mockDetails"],
            model: "mockModelName"
          }
        };

        expect(auditDataAccess).toHaveBeenCalledWith(
          request.nickname,
          existingCase.id,
          MANAGER_TYPE.COMPLAINT,
          AUDIT_FILE_TYPE.DRAFT_REFERRAL_LETTER_PDF,
          expectedAuditDetails,
          expect.anything()
        );
      });
    });
  });

  describe("case in invalid status", () => {
    test("expects boom to have error when case is in invalid status", async () => {
      await getReferralLetterPdf(request, response, next);
      expect(next).toHaveBeenCalledWith(
        Boom.badRequest(BAD_REQUEST_ERRORS.INVALID_CASE_STATUS)
      );
    });
  });
});
