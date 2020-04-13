import { getNotificationsSuccess } from "../../actionCreators/notificationActionCreators";
import getNotificationsReducer from "./getNotificationsReducer";

describe("getNotificationsReducer", () => {
  test("should initialize to blank array", () => {
    const newState = getNotificationsReducer(undefined, {
      type: "Something"
    });
    expect(newState).toEqual([]);
  });

  test("should set given notifications in state", () => {
    const notifications = [
      {
        user: "veronicablackwell@tw.com",
        updatedAt: "2020-03-19T18:57:31.953Z",
        caseReference: "AC2020-0004",
        author: "Syd Botz"
      }
    ];

    const newState = getNotificationsReducer(
      undefined,
      getNotificationsSuccess(notifications)
    );

    expect(newState).toEqual(notifications);
  });
});
