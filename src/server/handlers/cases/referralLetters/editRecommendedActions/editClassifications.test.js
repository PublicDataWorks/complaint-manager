import { cleanupDatabase } from "../../../../testHelpers/requestTestHelpers";
import httpMocks from "node-mocks-http";
import Case from "../../../../../sharedTestHelpers/case";
import models from "../../../../policeDataManager/models";
import { CASE_STATUS } from "../../../../../sharedUtilities/constants";
import editClassifications from "./editClassifications";

describe("editClassifications", () => {
  let response, request, next, existingCase;

  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  beforeEach(async () => {
    response = httpMocks.createResponse();
    next = jest.fn();

    const caseAttributes = new Case.Builder().defaultCase().withId(undefined);
    existingCase = await models.cases.create(caseAttributes, {
      auditUser: "test"
    });
    await existingCase.update(
      { status: CASE_STATUS.ACTIVE },
      { auditUser: "test" }
    );

    for (let i = 1; i <= 4; i++) {
      await models.classification.create({
        id: i,
        name: `csfn-${i}`,
        message: "HELP"
      });
    }

    const classifications = [1, 2, null, null];
    const requestBody = {
      classifications: classifications
    };
    request = httpMocks.createRequest({
      method: "PUT",
      headers: {
        authorization: "Bearer token"
      },
      params: { caseId: existingCase.id },
      body: requestBody,
      nickname: "nickname"
    });
    await existingCase.update(
      { status: CASE_STATUS.LETTER_IN_PROGRESS },
      { auditUser: "test" }
    );
  });

  test("saves new classifications", async () => {
    await editClassifications(request, response, next);
    expect(response.statusCode).toEqual(200);
    const caseClassification = await models.case_classification.findAll();
    expect(caseClassification).toIncludeSameMembers([
      expect.objectContaining({
        caseId: existingCase.id,
        classificationId: 1
      }),
      expect.objectContaining({
        caseId: existingCase.id,
        classificationId: 2
      })
    ]);
  });

  test("clears table when new classifications are updated and doesn't duplicate existing classifications", async () => {
    await editClassifications(request, response, next);

    const newClassifications = [null, 2, 3, 4];
    const requestBody = {
      classifications: newClassifications
    };
    const newRequest = httpMocks.createRequest({
      method: "PUT",
      headers: {
        authorization: "Bearer token"
      },
      params: { caseId: existingCase.id },
      body: requestBody,
      nickname: "nickname"
    });
    await editClassifications(newRequest, response, next);
    expect(response.statusCode).toEqual(200);

    const caseClassification = await models.case_classification.findAll();
    expect(caseClassification).toIncludeSameMembers([
      expect.objectContaining({
        caseId: existingCase.id,
        classificationId: 3
      }),
      expect.objectContaining({
        caseId: existingCase.id,
        classificationId: 4
      }),
      expect.objectContaining({
        caseId: existingCase.id,
        classificationId: 2
      })
    ]);
  });
});
