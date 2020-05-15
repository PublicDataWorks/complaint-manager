import configureInterceptors from "../../../common/axiosInterceptors/interceptors";
import getNotifications from "./getNotifications";
import { getNotificationsSuccess } from "../../actionCreators/notificationActionCreators";

describe("get notifications", () => {
  const dispatch = jest.fn();
  configureInterceptors({ dispatch });

  beforeEach(() => {
    dispatch.mockClear();
  });

  test("dispatches getNotificationSuccess", async () => {
    const notifications = [
      { user: "test@test.com", hasBeenRead: true },
      { user: "test1@test.com", hasBeenRead: false }
    ];

    await getNotifications(notifications)(dispatch);
    expect(dispatch).toHaveBeenCalledWith(
      getNotificationsSuccess(notifications)
    );
  });
});
