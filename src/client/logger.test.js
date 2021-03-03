import axios from "axios";
import logger from "./logger";

const messages = [
  {
    label: "Client-side Log",
    level: "info",
    message: "This is a test 1",
    timestamp: `${new Date()}`
  }
];

jest.mock("axios");

describe("Custom logger", () => {
  test("should POST logs to server", () => {
    logger.info("This is a test 1");

    expect(axios.post).toHaveBeenCalledWith("/api/logs", {
      messages: expect.arrayContaining([
        expect.objectContaining({
          label: expect.any(String),
          level: "info",
          message: "This is a test 1",
          timestamp: expect.any(String)
        })
      ])
    });
  });
});
