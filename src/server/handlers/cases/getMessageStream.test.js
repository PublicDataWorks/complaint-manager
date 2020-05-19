import {
  getClients,
  getMessageStream,
  getActiveClients,
  sendNotification
} from "./getMessageStream";
import mockFflipObject from "../../testHelpers/mockFflipObject";
import { sendMessage } from "./helpers/messageStreamHelpers";

const httpMocks = require("node-mocks-http");

jest.mock("./getNotifications", () => ({
  getNotifications: jest.fn(() => {
    return [
      { user: "wancheny@gmail.com", hasBeenRead: true },
      { user: "random@gmail.com", hasBeenRead: false }
    ];
  })
}));

jest.mock("./helpers/messageStreamHelpers", () => ({
  sendMessage: jest.fn()
}));

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

  test("should add new client regardless of whether email already has a connection", async () => {
    const clients = getClients();

    expect(clients).toEqual([
      expect.objectContaining({ email: "test@test.com" }),
      expect.objectContaining({ email: "test1@test.com" }),
      expect.objectContaining({ email: "test2@test.com" })
    ]);

    request.nickname = "test@test.com";

    await getMessageStream(request, response, next);

    const newClients = getClients();

    expect(newClients).toEqual([
      expect.objectContaining({ email: "test@test.com" }),
      expect.objectContaining({ email: "test1@test.com" }),
      expect.objectContaining({ email: "test2@test.com" }),
      expect.objectContaining({ email: "test@test.com" })
    ]);
  });

  test("should return all active clients for each email", async () => {
    request.nickname = "test@test.com";

    await getMessageStream(request, response, next);

    const activeClients = getActiveClients("test@test.com");

    expect(activeClients).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ email: "test@test.com" }),
        expect.objectContaining({ email: "test@test.com" })
      ])
    );

    const undefinedClients = getActiveClients("test3@test.com");

    expect(undefinedClients).toEqual([]);
  });

  test("should call sendMessage and getNotifications from sendNotifications", async () => {
    await sendNotification("test@test.com");
    expect(sendMessage).toHaveBeenCalledWith(
      "notifications",
      getActiveClients("test@test.com")[0],
      [
        { user: "wancheny@gmail.com", hasBeenRead: true },
        { user: "random@gmail.com", hasBeenRead: false }
      ]
    );
  });

  test("should set access-control-allow-origin response header if only in the development env for e2e testing", async () => {
    process.env.NODE_ENV = "development_e2e";
    request.nickname = "test1@test.com";

    await getMessageStream(request, response, next);

    expect(response._headers).toEqual(
      expect.objectContaining({
        "access-control-allow-origin": "https://app-e2e"
      })
    );
  });
});
