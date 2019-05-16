import Officer from "../../../../client/testUtilities/Officer";
import CaseOfficer from "../../../../client/testUtilities/caseOfficer";
import models from "../../../models";
import Case from "../../../../client/testUtilities/case";
import httpMocks from "node-mocks-http";
import {
  AUDIT_ACTION,
  AUDIT_SUBJECT,
  AUDIT_TYPE,
  WITNESS
} from "../../../../sharedUtilities/constants";
import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import removeCaseOfficer from "./removeCaseOfficer";
import Allegation from "../../../../client/testUtilities/Allegation";
import OfficerAllegation from "../../../../client/testUtilities/OfficerAllegation";

//mocked implementation in "/handlers/__mocks__/getQueryAuditAccessDetails"
jest.mock("../../getQueryAuditAccessDetails");

describe("removeCaseOfficer", () => {
  afterEach(async () => {
    await cleanupDatabase();
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

    test("should audit removing case officer", async () => {
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

      const audit = await models.action_audit.findOne({
        where: { caseId: existingCase.id }
      });

      expect(audit).toEqual(
        expect.objectContaining({
          user: "someone",
          subject: AUDIT_SUBJECT.CASE_DETAILS,
          caseId: existingCase.id,
          action: AUDIT_ACTION.DATA_ACCESSED,
          auditType: AUDIT_TYPE.DATA_ACCESS,
          auditDetails: { ["Mock Association"]: ["Mock Details"] }
        })
      );
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
});
