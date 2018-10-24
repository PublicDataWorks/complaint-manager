import getLetterPreview from "./getLetterPreview";
import httpMocks from "node-mocks-http";
import { CASE_STATUS } from "../../../../../sharedUtilities/constants";
import Case from "../../../../../client/testUtilities/case";
import models from "../../../../models";
import { cleanupDatabase } from "../../../../testHelpers/requestTestHelpers";

describe("getLetterPreview", function() {
  let existingCase;

  afterEach(async () => {
    await cleanupDatabase();
  });

  test("calls handler", async () => {
    const caseAttributes = new Case.Builder().defaultCase().withId(undefined);
    existingCase = await models.cases.create(caseAttributes, {
      auditUser: "test"
    });
    await existingCase.update(
      { status: CASE_STATUS.ACTIVE },
      { auditUser: "test" }
    );
    await existingCase.update(
      { status: CASE_STATUS.LETTER_IN_PROGRESS },
      { auditUser: "test" }
    );

    const request = httpMocks.createRequest({
      method: "GET",
      headers: {
        authorization: "Bearer token"
      },
      params: { id: existingCase.id },
      nickname: "nickname"
    });

    const response = httpMocks.createResponse();
    const next = jest.fn();

    await getLetterPreview(request, response, next);
  });
});
