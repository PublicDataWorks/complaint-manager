import { sendMessage } from "./messageStreamHelpers";
import { suppressWinstonLogs } from "../../../testHelpers/requestTestHelpers";

const httpMocks = require("node-mocks-http");

describe("message stream helpers", () => {
  test("sendMessage throws error on serialization failrues", () => {
    suppressWinstonLogs(() => {
      const response = httpMocks.createResponse();
      const user = {
        id: Date.now(),
        email: "test@test.com",
        response: response
      };
      const type = "mockType";
      const message = { x: 2n };

      expect(() => {
        sendMessage(type, user, message);
      }).toThrow("Do not know how to serialize a BigInt");
    });
  });

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
