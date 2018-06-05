import models from "../../models";
const httpMocks = require("node-mocks-http");
import createCivilian from "./createCivilian";
import Case from "../../../client/testUtilities/case";

describe("createCivilian handler", () => {
  afterEach(async () => {
    await models.cases.truncate({ cascade: true, auditUser: "someone" });
    await models.data_change_audit.truncate();
  });
  test("should not create an address when no address values given", async () => {
    const caseAttributes = new Case.Builder().defaultCase().build();
    const createdCase = await models.cases.create(caseAttributes, {
      auditUser: "someone"
    });

    const civilianValues = {
      firstName: "Test",
      lastName: "Name",
      phoneNumber: "1234567890",
      caseId: createdCase.id
    };

    const request = httpMocks.createRequest({
      method: "POST",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      body: civilianValues,
      nickname: "TEST_USER_NICKNAME"
    });
    const response = httpMocks.createResponse();

    await createCivilian(request, response, jest.fn());

    const createdCivilian = await models.civilian.find({
      where: { caseId: createdCase.id }
    });

    const civilianAddress = await models.address.find({
      where: {
        addressableId: createdCivilian.id,
        addressableType: "civilian"
      }
    });

    expect(civilianAddress).toEqual(null);
  });
});
