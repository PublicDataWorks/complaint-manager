import models from "../../../models";
import Allegation from "../../../../client/testUtilities/Allegation";
import CaseOfficer from "../../../../client/testUtilities/caseOfficer";
import Case from "../../../../client/testUtilities/case";
import Officer from "../../../../client/testUtilities/Officer";
import * as httpMocks from "node-mocks-http";
import createOfficerAllegation from "./createOfficerAllegation";
import Boom from "boom";

describe("createOfficerAllegation", () => {
  let newCase, allegation;

  beforeEach(async () => {
    const officerAttributes = new Officer.Builder()
      .defaultOfficer()
      .withId(undefined)
      .build();

    const officer = await models.officer.create(officerAttributes);

    const caseOfficerAttributes = new CaseOfficer.Builder()
      .defaultCaseOfficer()
      .withId(undefined)
      .withOfficerId(officer.id)
      .build();

    const caseAttributes = new Case.Builder()
      .defaultCase()
      .withId(undefined)
      .withIncidentLocation(undefined)
      .withAccusedOfficers([caseOfficerAttributes])
      .build();

    newCase = await models.cases.create(caseAttributes, {
      auditUser: "someone",
      include: [
        {
          model: models.case_officer,
          as: "accusedOfficers",
          auditUser: "someone"
        }
      ]
    });

    const allegationAttributes = new Allegation.Builder()
      .defaultAllegation()
      .withId(undefined)
      .build();

    allegation = await models.allegation.create(allegationAttributes);
  });

  afterEach(async () => {
    await models.address.destroy({
      truncate: true,
      cascade: true,
      force: true,
      auditUser: "test user"
    });
    await models.case_officer.destroy({
      truncate: true,
      cascade: true,
      auditUser: "test user"
    });
    await models.civilian.destroy({
      truncate: true,
      cascade: true,
      force: true,
      auditUser: "test user"
    });
    await models.cases.destroy({
      truncate: true,
      cascade: true,
      auditUser: "test user"
    });
    await models.officer.destroy({ truncate: true, cascade: true });
    await models.data_change_audit.truncate();
  });

  test("it calls next with an error if details are missing", async () => {
    const caseOfficer = newCase.accusedOfficers[0];

    const request = httpMocks.createRequest({
      method: "POST",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      params: {
        caseId: newCase.id,
        caseOfficerId: caseOfficer.id
      },
      body: {
        allegationId: allegation.id,
        details: null
      },
      nickname: "TEST_USER_NICKNAME"
    });

    const response = httpMocks.createResponse();
    const next = jest.fn();

    await createOfficerAllegation(request, response, next);

    expect(next).toHaveBeenCalledWith(
      Boom.badImplementation(
        "notNull Violation: officer_allegation.details cannot be null"
      )
    );
  });

  test("it creates the officer allegation in the database", async () => {
    const caseOfficer = newCase.accusedOfficers[0];
    const allegationDetails = "test details";

    const request = httpMocks.createRequest({
      method: "POST",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      params: {
        caseId: newCase.id,
        caseOfficerId: caseOfficer.id
      },
      body: {
        allegationId: allegation.id,
        details: allegationDetails
      },
      nickname: "TEST_USER_NICKNAME"
    });

    const response = httpMocks.createResponse();
    const next = jest.fn();

    await createOfficerAllegation(request, response, next);

    const officerAllegation = await models.officer_allegation.findOne({
      where: { caseOfficerId: caseOfficer.id, allegationId: allegation.id }
    });

    expect(officerAllegation).toEqual(
      expect.objectContaining({ details: allegationDetails })
    );
  });
});
