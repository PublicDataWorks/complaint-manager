import httpMocks from "node-mocks-http";
import logHandler from "./logHandler";

describe("logHandler", () => {
  let request, response, next;

  test("should log each message", async () => {
    const consoleSpy = jest.spyOn(console, "log");
    consoleSpy.mockImplementation(() => {});
    request = httpMocks.createRequest({
      method: "POST",
      headers: {
        authorization: "Bearer Token"
      },
      nickname: "nickname",
      body: {
        messages: [
          {
            level: "MEDIUM",
            message: "very medium",
            timestamp: new Date(),
            label: "lbl"
          },
          {
            level: "HIGH",
            message: "super high",
            timestamp: new Date(),
            label: "lbl"
          },
          { level: "LOW", message: "nbd", timestamp: new Date(), label: "lbl" }
        ]
      }
    });
    response = httpMocks.createResponse();
    next = jest.fn();

    await logHandler(request, response, next);

    expect(consoleSpy).toHaveBeenCalledTimes(3);
  });
});
