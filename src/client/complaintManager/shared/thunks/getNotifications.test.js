import configureInterceptors from "../../../common/axiosInterceptors/interceptors";
import nock from "nock";
import getAccessToken from "../../../common/auth/getAccessToken";
import getNotifications from "./getNotifications";
import { getNotificationsSuccess } from "../../actionCreators/notificationActionCreators";
import moment from "moment";

jest.mock("../../../common/auth/getAccessToken");

describe("get notifications", () => {
  const user = "test@test.com";
  const thirtyDaysAgo = moment().subtract(30, "days");
  const dispatch = jest.fn();
  configureInterceptors({ dispatch });
  const token = "token";

  beforeEach(() => {
    dispatch.mockClear();
  });

  test("dispatches getNotificationSuccess", async () => {
    const responseBody = [{ notifications: "some notifs" }];
    nock("http://localhost/", {
      reqheaders: {
        Authorization: `Bearer ${token}`
      }
    })
      .get(`/api/notifications/${user}/`)
      .query(true)
      .reply(200, responseBody);

    getAccessToken.mockImplementation(() => token);

    await getNotifications(user, thirtyDaysAgo)(dispatch);
    expect(dispatch).toHaveBeenCalledWith(
      getNotificationsSuccess(responseBody)
    );
  });
});
