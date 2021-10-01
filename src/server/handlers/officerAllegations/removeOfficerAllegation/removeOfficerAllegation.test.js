import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import { createTestCaseWithoutCivilian } from "../../../testHelpers/modelMothers";
import CaseOfficer from "../../../../sharedTestHelpers/caseOfficer";
import Allegation from "../../../../sharedTestHelpers/Allegation";
import {
  ACCUSED,
  AUDIT_SUBJECT,
  MANAGER_TYPE
} from "../../../../sharedUtilities/constants";
import OfficerAllegation from "../../../../sharedTestHelpers/OfficerAllegation";
import httpMocks from "node-mocks-http";
import models from "../../../policeDataManager/models";
import removeOfficerAllegation from "./removeOfficerAllegation";
import Boom from "boom";
import { BAD_REQUEST_ERRORS } from "../../../../sharedUtilities/errorMessageConstants";
import auditDataAccess from "../../audits/auditDataAccess";
import { expectedCaseAuditDetails } from "../../../testHelpers/expectedAuditDetails";

jest.mock("../../audits/auditDataAccess");

describe("removeOfficerAllegation", () => {
  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  test("should reply 404 if officer allegation does not exist", async () => {
    const nonexistentOfficerAllegationId = 12;

    const request = httpMocks.createRequest({
      method: "DELETE",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      params: {
        officerAllegationId: nonexistentOfficerAllegationId
      },
      nickname: "TEST_USER_NICKNAME"
    });

    const response = httpMocks.createResponse();
    const next = jest.fn();

    await removeOfficerAllegation(request, response, next);

    expect(next).toHaveBeenCalledWith(
      Boom.notFound(BAD_REQUEST_ERRORS.OFFICER_ALLEGATION_NOT_FOUND)
    );
  });

  describe("should remove officer allegation", () => {
    let officerAllegationToRemove, createdAccusedOfficer;

    beforeEach(async () => {
      const createdCase = await createTestCaseWithoutCivilian();
      const anAllegation = new Allegation.Builder()
        .defaultAllegation()
        .withId(undefined)
        .build();

      const createdAllegation = await models.allegation.create(anAllegation, {
        auditUser: "someone"
      });
      const anOfficerAllegation = new OfficerAllegation.Builder()
        .defaultOfficerAllegation()
        .withId(undefined)
        .withDetails("old details")
        .withAllegationId(createdAllegation.id);

      const accusedOfficer = new CaseOfficer.Builder()
        .defaultCaseOfficer()
        .withUnknownOfficer()
        .withId(undefined)
        .withRoleOnCase(ACCUSED)
        .withOfficerAllegations([anOfficerAllegation])
        .build();

      createdAccusedOfficer = await createdCase.createAccusedOfficer(
        accusedOfficer,
        {
          include: [
            {
              model: models.officer_allegation,
              as: "allegations",
              auditUser: "someone"
            }
          ],
          auditUser: "someone"
        }
      );

      officerAllegationToRemove = createdAccusedOfficer.allegations[0];
    });

    test("should clear out officer allegation on remove", async () => {
      const request = httpMocks.createRequest({
        method: "DELETE",
        headers: {
          authorization: "Bearer SOME_MOCK_TOKEN"
        },
        params: {
          officerAllegationId: officerAllegationToRemove.id
        },
        nickname: "TEST_USER_NICKNAME"
      });

      const response = httpMocks.createResponse();

      await removeOfficerAllegation(request, response, jest.fn());

      await createdAccusedOfficer.reload();

      expect(createdAccusedOfficer.allegations).toEqual([]);
    });

    describe("auditing", () => {
      test("should audit case details access on remove officer allegation", async () => {
        const request = httpMocks.createRequest({
          method: "DELETE",
          headers: {
            authorization: "Bearer SOME_MOCK_TOKEN"
          },
          params: {
            officerAllegationId: officerAllegationToRemove.id
          },
          nickname: "TEST_USER_NICKNAME"
        });

        const response = httpMocks.createResponse();
        const next = jest.fn();

        await removeOfficerAllegation(request, response, next);

        expect(auditDataAccess).toHaveBeenCalledWith(
          request.nickname,
          createdAccusedOfficer.caseId,
          MANAGER_TYPE.COMPLAINT,
          AUDIT_SUBJECT.CASE_DETAILS,
          expectedCaseAuditDetails,
          expect.anything()
        );
      });
    });
  });
});
