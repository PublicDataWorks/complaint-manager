import * as httpMocks from "node-mocks-http";
import updateSearchIndexHandler from "./updateSearchIndex";
import { updateSearchIndex } from "../../../../sharedUtilities/search/searchUtilities";

jest.mock("../../../../sharedUtilities/search/searchUtilities", () => ({
  updateSearchIndex: jest.fn()
}));

describe("updateSearchIndex handler", () => {
  let request, response, next;

  beforeEach(async () => {
    request = httpMocks.createRequest();
    response = httpMocks.createResponse();
    next = jest.fn();
  });

  test("should call updateSearchIndex and return a 202", async () => {
    await updateSearchIndexHandler(request, response, next);
    expect(updateSearchIndex).toHaveBeenCalled();
    expect(response.statusCode).toEqual(202);
  });
});
