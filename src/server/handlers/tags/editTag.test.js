import Boom from "boom";
import editTag from "./editTag";
import httpMocks from "node-mocks-http";
import { BAD_REQUEST_ERRORS } from "../../../sharedUtilities/errorMessageConstants";

const mockHelper = jest.fn();

jest.mock(
  "./editTagHelper",
  () => (request, id, tag) => mockHelper(request, id, tag)
);

describe("editTag", () => {
  let request, response, next;

  beforeEach(async () => {
    request = httpMocks.createRequest({
      method: "PUT",
      headers: {
        authorization: "Bearer Token"
      },
      nickname: "nickname",
      body: {
        id: 1,
        name: "Mr. Tags"
      },
      params: {
        id: 1
      }
    });
    response = httpMocks.createResponse();
    next = jest.fn();
  });

  test("should handle error by passing it to next", async () => {
    mockHelper.mockImplementation(() => {
      throw Boom.badRequest(BAD_REQUEST_ERRORS.TAG_WITH_NAME_EXISTS);
    });
    await editTag(request, response, next);
    expect(next).toHaveBeenCalledWith(
      Boom.badRequest(BAD_REQUEST_ERRORS.TAG_WITH_NAME_EXISTS)
    );
  });

  test("should update the name of the tag if that name does not already exist", async () => {
    mockHelper.mockReturnValue({
      id: 1,
      name: "Mr. Tags"
    });
    await editTag(request, response, next);
    expect(response._getData()).toEqual(
      JSON.stringify({ id: 1, name: "Mr. Tags" })
    );
    expect(mockHelper).toHaveBeenCalledWith(request, 1, {
      id: 1,
      name: "Mr. Tags"
    });
  });
});
