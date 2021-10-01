import Officer from "../../../../sharedTestHelpers/Officer";
import CaseOfficer from "../../../../sharedTestHelpers/caseOfficer";
import models from "../../../policeDataManager/models";
import Case from "../../../../sharedTestHelpers/case";
import httpMocks from "node-mocks-http";
import {
  AUDIT_SUBJECT,
  MANAGER_TYPE,
  WITNESS
} from "../../../../sharedUtilities/constants";
import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import removeCaseOfficer from "./removeCaseOfficer";
import Allegation from "../../../../sharedTestHelpers/Allegation";
import OfficerAllegation from "../../../../sharedTestHelpers/OfficerAllegation";
import auditDataAccess from "../../audits/auditDataAccess";
import { expectedCaseAuditDetails } from "../../../testHelpers/expectedAuditDetails";

jest.mock("../../audits/auditDataAccess");

describe("removeCaseOfficer", () => {
  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  let existingCase, existingCaseOfficer, next, response;
  beforeEach(async () => {
    next = jest.fn();
    response = httpMocks.createResponse();

    const officerAttributes = new Officer.Builder()
      .defaultOfficer()
      .withId(undefined)
      .withSupervisorOfficerNumber(undefined)
      .build();
    const createdOfficer = await models.officer.create(officerAttributes);

    const caseOfficerAttributes = new CaseOfficer.Builder()
      .defaultCaseOfficer()
      .withId(undefined)
      .withOfficerId(createdOfficer.id)
      .withRoleOnCase(WITNESS)
      .build();
    const caseAttributes = new Case.Builder()
      .defaultCase()
      .withId(undefined)
      .withWitnessOfficers([caseOfficerAttributes])
      .build();

    existingCase = await models.cases.create(caseAttributes, {
      include: {
        model: models.case_officer,
        as: "witnessOfficers",
        auditUser: "someone"
      },
      auditUser: "someone"
    });
    existingCaseOfficer = existingCase.witnessOfficers[0];
  });

  test("should remove existing officer from case", async () => {
    const request = httpMocks.createRequest({
      method: "DELETE",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      params: {
        caseId: existingCase.id,
        caseOfficerId: existingCaseOfficer.id
      },
      nickname: "someone"
    });

    await removeCaseOfficer(request, response, next);
    const removedCaseOfficer = await models.case_officer.findByPk(
      existingCaseOfficer.id
    );

    expect(removedCaseOfficer).toEqual(null);
  });

  describe("removing caseOfficers with associated allegations", () => {
    beforeEach(async () => {
      await createOfficerAllegation();
    });

    test("should remove allegations when removing existing officer", async () => {
      const request = httpMocks.createRequest({
        method: "DELETE",
        headers: {
          authorization: "Bearer SOME_MOCK_TOKEN"
        },
        params: {
          caseId: existingCase.id,
          caseOfficerId: existingCaseOfficer.id
        },
        nickname: "someone"
      });

      await removeCaseOfficer(request, response, next);
      const officerAllegation = await models.officer_allegation.findOne({
        where: {
          caseOfficerId: existingCaseOfficer.id
        }
      });

      expect(officerAllegation).toEqual(null);
    });

    test("should not delete associated officerAllegations when caseOfficer deletion fails", async () => {
      const request = httpMocks.createRequest({
        method: "DELETE",
        headers: {
          authorization: "Bearer SOME_MOCK_TOKEN"
        },
        params: {
          caseId: existingCase.id,
          caseOfficerId: existingCaseOfficer.id
        },
        nickname: null
      });

      await removeCaseOfficer(request, response, next);

      const officerAllegation = await models.officer_allegation.findOne({
        where: { caseOfficerId: existingCaseOfficer.id }
      });

      expect(officerAllegation).not.toEqual(null);
    });

    async function createOfficerAllegation() {
      const allegationAttributes = new Allegation.Builder()
        .defaultAllegation()
        .build();
      const allegation = await models.allegation.create(allegationAttributes);
      const officerAllegationAttributes = new OfficerAllegation.Builder()
        .defaultOfficerAllegation()
        .withCaseOfficerId(existingCaseOfficer.id)
        .withAllegationId(allegation.id)
        .build();
      await models.officer_allegation.create(officerAllegationAttributes, {
        auditUser: "someone"
      });
    }
  });

  describe("auditing", () => {
    let request;
    beforeEach(() => {
      request = httpMocks.createRequest({
        method: "DELETE",
        headers: {
          authorization: "Bearer SOME_MOCK_TOKEN"
        },
        params: {
          caseId: existingCase.id,
          caseOfficerId: existingCaseOfficer.id
        },
        nickname: "someone"
      });
    });

    test("should audit case details access when case officer removed", async () => {
      await removeCaseOfficer(request, response, next);

      expect(auditDataAccess).toHaveBeenCalledWith(
        request.nickname,
        existingCase.id,
        MANAGER_TYPE.COMPLAINT,
        AUDIT_SUBJECT.CASE_DETAILS,
        expectedCaseAuditDetails,
        expect.anything()
      );
    });
  });
});
