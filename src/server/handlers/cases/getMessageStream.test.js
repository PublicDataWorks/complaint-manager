import { getClients, getMessageStream } from "./getMessageStream";
import mockFflipObject from "../../testHelpers/mockFflipObject";

const httpMocks = require("node-mocks-http");

describe("get message stream", () => {
  let request, response, next;

  beforeEach(async () => {
    request = httpMocks.createRequest({
      method: "GET",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      nickname: "test@test.com"
    });
    response = httpMocks.createResponse();
    next = jest.fn();

    request.fflip = mockFflipObject({ realtimeNotificationsFeature: true });
  });

  test("should set response headers", async () => {
    await getMessageStream(request, response, next);

    expect(response._headers).toEqual({
      "cache-control": "no-cache",
      "content-type": "text/event-stream",
      connection: "keep-alive"
    });
  });

  test("should set access-control-allow-origin response header if only in the development env", async () => {
    process.env.NODE_ENV = "development";
    request.nickname = "test1@test.com";

    await getMessageStream(request, response, next);

    expect(response._headers).toEqual(
      expect.objectContaining({
        "access-control-allow-origin": "https://localhost"
      })
    );
  });

  test("server should send connection message to any new client", async () => {
    request.nickname = "test2@test.com";

    await getMessageStream(request, response, next);

    expect(response._getData()).toEqual(expect.stringContaining("connection"));
  });

  test("server should maintain correct list of clients", async () => {
    const clients = getClients();

    expect(clients).toEqual([
      expect.objectContaining({ id: "test@test.com" }),
      expect.objectContaining({ id: "test1@test.com" }),
      expect.objectContaining({ id: "test2@test.com" })
    ]);
  });
});
