import { sendMessage } from "./messageStreamHelpers";

const httpMocks = require("node-mocks-http");

describe("message stream helpers", () => {
  test("sendMessage should write message to response", () => {
    const response = httpMocks.createResponse();
    const user = { id: Date.now(), email: "test@test.com", response: response };
    const type = "mockType";
    const message = "we testing out here!";

    sendMessage(type, user, message);

    expect(user.response._getData()).toEqual(
      'data: {"type":"mockType","message":"we testing out here!"}\n\n'
    );
  });
});
