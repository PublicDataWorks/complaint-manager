import Boom from "boom";
import mergeTag from "./mergeTag";
import httpMocks from "node-mocks-http";
import {
  NOT_FOUND_ERRORS,
} from "../../../sharedUtilities/errorMessageConstants";

const mockHelper = jest.fn();

jest.mock("./mergeTagHelper", () => (request, id, mergeTagId) => mockHelper(request, id, mergeTagId));

describe("mergeTag", () => {
  let request, response, next;

  beforeEach(async () => {
    request = httpMocks.createRequest({
      method: "PATCH",
      headers: {
        authorization: "Bearer Token"
      },
      nickname: "nickname",
      params: {
        id: 1
      },
      body: {
        mergeTagId: 40221
      }
    });
    response = httpMocks.createResponse();
    next = jest.fn();
  });

  test("should handle error by passing it to next", async () => {
    mockHelper.mockImplementation(() => {
      throw Boom.notFound(NOT_FOUND_ERRORS.RESOURCE_NOT_FOUND);
    });
    await mergeTag(request, response, next);
    expect(next).toHaveBeenCalledWith(
      Boom.notFound(NOT_FOUND_ERRORS.RESOURCE_NOT_FOUND)
    );
  });

  test("should merge the tag and return a success status of 200", async () => {
    await mergeTag(request, response, next);
    expect(response.statusCode).toEqual(200);
    expect(mockHelper).toHaveBeenCalledWith(request, 1, 40221);
  });
});
