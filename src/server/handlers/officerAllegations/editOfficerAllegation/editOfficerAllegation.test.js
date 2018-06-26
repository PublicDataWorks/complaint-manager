import { cleanupDatabase } from "../../../requestTestHelpers";
import { createCaseWithoutCivilian } from "../../../modelTestHelpers/helpers";
import CaseOfficer from "../../../../client/testUtilities/caseOfficer";
import Allegation from "../../../../client/testUtilities/Allegation";
import { ACCUSED } from "../../../../sharedUtilities/constants";
import OfficerAllegation from "../../../../client/testUtilities/OfficerAllegation";
import httpMocks from "node-mocks-http";
import models from "../../../models";
import editOfficerAllegation from "./editOfficerAllegation";

describe("editOfficerAllegation", () => {
  afterEach(async () => {
    await cleanupDatabase();
  });

  test("should edit a case officer allegation", async () => {
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

    const officerAllegationToUpdate =
      createdCase.accusedOfficers[0].allegations[0];

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

    await officerAllegationToUpdate.reload();

    expect(officerAllegationToUpdate.details).toEqual("new details");
  });
});
