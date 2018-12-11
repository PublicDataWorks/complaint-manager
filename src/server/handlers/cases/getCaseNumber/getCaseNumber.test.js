import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import Case from "../../../../client/testUtilities/case";
import { CIVILIAN_INITIATED } from "../../../../sharedUtilities/constants";
import models from "../../../models";
import httpMocks from "node-mocks-http";
import getCaseNumber from "./getCaseNumber";

describe("getCaseNumber", () => {
  let response, next, request, existingCase;

  afterEach(async () => {
    await cleanupDatabase();
  });

  beforeEach(async () => {
    const caseAttributes = new Case.Builder()
      .defaultCase()
      .withId(205)
      .withFirstContactDate("2017-12-25")
      .withComplaintType(CIVILIAN_INITIATED)
      .withComplainantCivilians([]);

    existingCase = await models.cases.create(caseAttributes, {
      include: [
        {
          model: models.civilian,
          as: "complainantCivilians",
          auditUser: "test"
        }
      ],
      auditUser: "test"
    });

    response = httpMocks.createResponse();
    next = jest.fn();

    request = httpMocks.createRequest({
      method: "GET",
      headers: {
        authorization: "Bearer token"
      },
      params: {
        id: existingCase.id
      },
      nickname: "nickname"
    });
  });

  test("gets case number", async () => {
    await getCaseNumber(request, response, next);
    const responseBody = response._getData();
    expect(responseBody.caseNumber).toEqual("CC2017-0205");
  });
});
