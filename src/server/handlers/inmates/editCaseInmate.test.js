import Case from "../../../sharedTestHelpers/case";
import CaseInmate from "../../../sharedTestHelpers/CaseInmate";
import CaseStatus from "../../../sharedTestHelpers/caseStatus";
import Inmate from "../../../sharedTestHelpers/Inmate";
import PersonType from "../../../sharedTestHelpers/PersonType";
import { USER_PERMISSIONS } from "../../../sharedUtilities/constants";
import { cleanupDatabase } from "../../testHelpers/requestTestHelpers";
import models from "../../policeDataManager/models";
import httpMocks from "node-mocks-http";
import editCaseInmate from "./editCaseInmate";
import Boom from "boom";
import { BAD_REQUEST_ERRORS } from "../../../sharedUtilities/errorMessageConstants";

describe("editCaseInmate", () => {
  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  let complainantInmate, existingCase, response, next;
  beforeEach(async () => {
    next = jest.fn();
    response = httpMocks.createResponse();

    await models.personType.create(
      new PersonType.Builder()
        .defaultPersonType()
        .withKey("PERSON_IN_CUSTODY")
        .build()
    );

    const inmate = await models.inmate.create(
      new Inmate.Builder().defaultInmate().build(),
      { auditUser: "user" }
    );

    complainantInmate = await models.caseInmate.create(
      new CaseInmate.Builder()
        .defaultCaseInmate()
        .withId(1)
        .withInmate(inmate)
        .withCaseId(17)
        .build(),
      { auditUser: "user" }
    );

    const status = await models.caseStatus.create(
      new CaseStatus.Builder().defaultCaseStatus().build(),
      { auditUser: "user" }
    );

    existingCase = await models.cases.create(
      new Case.Builder()
        .defaultCase()
        .withComplainantInmates(complainantInmate)
        .withStatus(status)
        .build(),
      { auditUser: "user" }
    );
  });

  test("Should update case inmate to anonymous and add notes", async () => {
    const request = httpMocks.createRequest({
      method: "PUT",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      body: {
        isAnonymous: true,
        notes: "Notes on Anonymous Human Being"
      },
      params: {
        caseId: existingCase.id + "",
        caseInmateId: complainantInmate.id + ""
      },
      nickname: "someone",
      permissions: USER_PERMISSIONS.EDIT_CASE
    });

    await editCaseInmate(request, response, next);
    const updatedCaseInmate = await models.caseInmate.findByPk(
      complainantInmate.id
    );

    expect(updatedCaseInmate.isAnonymous).toEqual(true);
    expect(updatedCaseInmate.notes).toEqual("Notes on Anonymous Human Being");
  });

  test("Should throw bad request error with incorrect caseInmateId", async () => {
    const request = httpMocks.createRequest({
      method: "PUT",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      body: {
        isAnonymous: true,
        notes: "Notes on Anonymous Human Being"
      },
      params: {
        caseId: existingCase.id,
        caseInmateId: 2
      },
      nickname: "someone",
      permissions: USER_PERMISSIONS.EDIT_CASE
    });

    await editCaseInmate(request, response, next);

    expect(next).toHaveBeenCalledWith(
      Boom.badRequest(BAD_REQUEST_ERRORS.INVALID_PERSON_IN_CUSTODY)
    );
  });
});
