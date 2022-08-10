import Boom from "boom";
import removeTag from "./removeTag";
import httpMocks from "node-mocks-http";
import { NOT_FOUND_ERRORS } from "../../../sharedUtilities/errorMessageConstants";

const mockHelper = jest.fn();

jest.mock("./removeTagHelper", () => (request, id) => mockHelper(request, id));

describe("removeTag", () => {
  let request, response, next;

  beforeEach(async () => {
    request = httpMocks.createRequest({
      method: "DELETE",
      headers: {
        authorization: "Bearer Token"
      },
      nickname: "nickname",
      params: {
        id: 1
      }
    });
    response = httpMocks.createResponse();
    next = jest.fn();
  });

  test("should handle error by passing it to next", async () => {
    mockHelper.mockImplementation(() => {
      throw Boom.notFound(NOT_FOUND_ERRORS.RESOURCE_NOT_FOUND);
    });
    await removeTag(request, response, next);
    expect(next).toHaveBeenCalledWith(
      Boom.notFound(NOT_FOUND_ERRORS.RESOURCE_NOT_FOUND)
    );
  });

  test("should remove the tag and return a success status < 204", async () => {
    await removeTag(request, response, next);
    expect(response.statusCode).toBeLessThanOrEqual(204);
    expect(mockHelper).toHaveBeenCalledWith(request, 1);
  });
});
