import createMatrix from "./createMatrix";
import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import models from "../../models";
import Boom from "boom";
import {
  BAD_DATA_ERRORS,
  BAD_REQUEST_ERRORS
} from "../../../../sharedUtilities/errorMessageConstants";
import auditDataAccess from "../../../handlers/audits/auditDataAccess";
import {
  AUDIT_SUBJECT,
  MANAGER_TYPE
} from "../../../../sharedUtilities/constants";

const httpMocks = require("node-mocks-http");
jest.mock("../../../handlers/audits/auditDataAccess");

describe("createMatrix handler", () => {
  let request, response, next, matrixDetails, user;

  beforeEach(() => {
    user = "TEST_USER_NICKNAME";

    matrixDetails = {
      pibControlNumber: "2019-0001-r",
      firstReviewer: "jacob@me.com",
      secondReviewer: "wanchen@me.com"
    };

    request = httpMocks.createRequest({
      method: "POST",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      body: {
        ...matrixDetails
      },
      nickname: user
    });
    response = httpMocks.createResponse();
    next = jest.fn();
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  test("should create matrix with capitalized pib control number", async () => {
    await createMatrix(request, response, next);
    const insertedMatrix = await models.matrices.findOne({
      where: { pibControlNumber: matrixDetails.pibControlNumber.toUpperCase() }
    });

    expect(insertedMatrix).toEqual(
      expect.objectContaining({
        pibControlNumber: matrixDetails.pibControlNumber.toUpperCase(),
        firstReviewer: matrixDetails.firstReviewer,
        secondReviewer: matrixDetails.secondReviewer
      })
    );
  });

  test("should send response and 201 status with created entity", async () => {
    await createMatrix(request, response, next);

    expect(response.statusCode).toEqual(201);
    expect(response._getData()).toEqual(
      expect.objectContaining({
        ...matrixDetails,
        pibControlNumber: matrixDetails.pibControlNumber.toUpperCase()
      })
    );
    expect(response._isEndCalled()).toBeTruthy();
  });

  test("should send error response when PIB control number already exists", async () => {
    // Create First Matrix
    await createMatrix(request, response, next);

    // Create Duplicate Matrix (existing PIB control number)
    await createMatrix(request, response, next);

    expect(next).toHaveBeenCalledWith(
      Boom.badRequest(BAD_REQUEST_ERRORS.PIB_CONTROL_NUMBER_ALREADY_EXISTS)
    );
  });

  describe("auditing", () => {
    test("should create data access audit when a new matrix is created", async () => {
      await createMatrix(request, response, next);

      const createdMatrix = await models.matrices.findOne({
        where: { pibControlNumber: "2019-0001-R" }
      });
      expect(auditDataAccess).toHaveBeenCalledWith(
        request.nickname,
        createdMatrix.id,
        MANAGER_TYPE.MATRIX,
        AUDIT_SUBJECT.MATRIX_DETAILS,
        {
          matrices: {
            attributes: Object.keys(models.matrices.rawAttributes),
            model: models.matrices.name
          }
        },
        expect.anything()
      );
    });
  });
});
