import createMatrix from "./createMatrix";
import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import models from "../../models";
import Boom from "boom";
import {
  BAD_DATA_ERRORS,
  BAD_REQUEST_ERRORS
} from "../../../../sharedUtilities/errorMessageConstants";

const httpMocks = require("node-mocks-http");

describe("createMatrix handler", () => {
  let request, response, next, matrixDetails, user;

  beforeEach(() => {
    user = "TEST_USER_NICKNAME";

    matrixDetails = {
      pibControlNumber: "2019-0001-R",
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

  test("should create matrix", async () => {
    await createMatrix(request, response, next);
    const insertedMatrix = await models.matrices.findOne({
      where: { pibControlNumber: matrixDetails.pibControlNumber }
    });

    expect(insertedMatrix).toEqual(
      expect.objectContaining({
        pibControlNumber: matrixDetails.pibControlNumber,
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
        ...matrixDetails
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
});
