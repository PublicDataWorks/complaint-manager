import { getDateAsString } from "./getDateAsString";

describe("get date as string", () => {
  let currentTime;

  test("should show AM when time is in the morning", () => {
    currentTime = "2020-01-12T12:57:31.953Z";
    const newTime = getDateAsString(currentTime);

    expect(newTime).toContain("AM");
  });

  test("should show PM when time is in the afternoon/evening", () => {
    currentTime = "2020-01-12T20:57:31.953Z";
    const newTime = getDateAsString(currentTime);

    expect(newTime).toContain("PM");
  });

  test("should not show military time", () => {
    currentTime = "2020-01-12T19:57:31.953Z";
    const newTime = getDateAsString(currentTime);

    expect(newTime).not.toContain("13:57");
  });
});
