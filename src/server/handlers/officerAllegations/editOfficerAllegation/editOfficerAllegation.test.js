import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import { createTestCaseWithoutCivilian } from "../../../testHelpers/modelMothers";
import CaseOfficer from "../../../../sharedTestHelpers/caseOfficer";
import Allegation from "../../../../sharedTestHelpers/Allegation";
import {
  ACCUSED,
  ALLEGATION_SEVERITY,
  AUDIT_SUBJECT,
  MANAGER_TYPE
} from "../../../../sharedUtilities/constants";
import OfficerAllegation from "../../../../sharedTestHelpers/OfficerAllegation";
import httpMocks from "node-mocks-http";
import models from "../../../policeDataManager/models";
import editOfficerAllegation from "./editOfficerAllegation";
import auditDataAccess from "../../audits/auditDataAccess";
import { expectedCaseAuditDetails } from "../../../testHelpers/expectedAuditDetails";

jest.mock("../../audits/auditDataAccess");

describe("editOfficerAllegation", () => {
  let officerAllegationToUpdate, caseOfficer, response;
  const next = jest.fn();

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
      .withSeverity(ALLEGATION_SEVERITY.LOW)
      .withAllegationId(createdAllegation.id);

    const accusedOfficer = new CaseOfficer.Builder()
      .defaultCaseOfficer()
      .withUnknownOfficer()
      .withId(undefined)
      .withRoleOnCase(ACCUSED)
      .withOfficerAllegations([anOfficerAllegation])
      .build();

    await createdCase.createAccusedOfficer(accusedOfficer, {
      include: [
        {
          model: models.officer_allegation,
          as: "allegations",
          auditUser: "someone"
        }
      ],
      auditUser: "someone"
    });

    await createdCase.reload({
      include: [
        {
          model: models.case_officer,
          as: "accusedOfficers",
          include: [{ model: models.officer_allegation, as: "allegations" }]
        }
      ]
    });

    caseOfficer = createdCase.accusedOfficers[0];
    officerAllegationToUpdate = caseOfficer.allegations[0];
    response = httpMocks.createResponse();
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  test("should edit a case officer allegation", async () => {
    const data = {
      details: "new details",
      severity: ALLEGATION_SEVERITY.HIGH
    };

    const request = httpMocks.createRequest({
      method: "PUT",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      params: {
        officerAllegationId: officerAllegationToUpdate.id
      },
      body: data,
      nickname: "TEST_USER_NICKNAME"
    });

    await editOfficerAllegation(request, response, jest.fn());

    await officerAllegationToUpdate.reload();

    expect(officerAllegationToUpdate.details).toEqual("new details");
    expect(officerAllegationToUpdate.severity).toEqual(
      ALLEGATION_SEVERITY.HIGH
    );
  });
  describe("auditing", () => {
    test("should audit case data access", async () => {
      const data = {
        details: "new details"
      };

      const request = httpMocks.createRequest({
        method: "PUT",
        headers: {
          authorization: "Bearer SOME_MOCK_TOKEN"
        },
        params: {
          officerAllegationId: officerAllegationToUpdate.id
        },
        body: data,
        nickname: "TEST_USER_NICKNAME"
      });
      const response = httpMocks.createResponse();
      const next = jest.fn();
      await editOfficerAllegation(request, response, next);

      expect(auditDataAccess).toHaveBeenCalledWith(
        request.nickname,
        caseOfficer.caseId,
        MANAGER_TYPE.COMPLAINT,
        AUDIT_SUBJECT.CASE_DETAILS,
        expectedCaseAuditDetails,
        expect.anything()
      );
    });
  });
});
