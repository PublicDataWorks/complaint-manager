import configureInterceptors from "../../axiosInterceptors/interceptors";
import getAccessToken from "../../auth/getAccessToken";
import nock from "nock";
import getHowDidYouHearAboutUsSourceDropdownValues from "./getHowDidYouHearAboutUsSourceDropdownValues";
import { getHowDidYouHearAboutUsSourcesSuccess } from "../../actionCreators/howDidYouHearAboutUsSourceActionCreators";

jest.mock("../../auth/getAccessToken");

describe("getIntakeSourceDropdownValues", () => {
  const dispatch = jest.fn();
  configureInterceptors({ dispatch });
  const hostname = "http://localhost";
  const apiRoute = "/api/how-did-you-hear-about-us-sources";

  beforeEach(async () => {
    getAccessToken.mockImplementation(() => "token");
  });

  test("it fetches how did you hear about us sources and dispatches them", async () => {
    const responseBody = [[1, "Facebook"], [2, "Friend"], [3, "NOIPM Website"]];

    nock(hostname)
      .get(apiRoute)
      .reply(200, responseBody);

    await getHowDidYouHearAboutUsSourceDropdownValues()(dispatch);
    expect(dispatch).toHaveBeenCalledWith(
      getHowDidYouHearAboutUsSourcesSuccess(responseBody)
    );
  });
});
