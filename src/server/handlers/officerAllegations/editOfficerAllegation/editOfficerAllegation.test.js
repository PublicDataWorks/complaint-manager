import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import { createCaseWithoutCivilian } from "../../../testHelpers/modelMothers";
import CaseOfficer from "../../../../client/testUtilities/caseOfficer";
import Allegation from "../../../../client/testUtilities/Allegation";
import {
  ACCUSED,
  ALLEGATION_SEVERITY,
  AUDIT_ACTION,
  AUDIT_SUBJECT,
  AUDIT_TYPE
} from "../../../../sharedUtilities/constants";
import OfficerAllegation from "../../../../client/testUtilities/OfficerAllegation";
import httpMocks from "node-mocks-http";
import models from "../../../models";
import editOfficerAllegation from "./editOfficerAllegation";

describe("editOfficerAllegation", () => {
  let officerAllegationToUpdate, caseOfficer, response;
  const next = jest.fn();

  beforeEach(async () => {
    const createdCase = await createCaseWithoutCivilian();
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

    await editOfficerAllegation(request, response, jest.fn());

    const audit = await models.action_audit.find({
      where: { caseId: caseOfficer.caseId }
    });

    expect(audit).toEqual(
      expect.objectContaining({
        user: "TEST_USER_NICKNAME",
        auditType: AUDIT_TYPE.DATA_ACCESS,
        subject: AUDIT_SUBJECT.CASE_DETAILS,
        caseId: caseOfficer.caseId,
        action: AUDIT_ACTION.DATA_ACCESSED
      })
    );
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
});
