import configureInterceptors from "../../../common/axiosInterceptors/interceptors";
import getAccessToken from "../../../common/auth/getAccessToken";
import nock from "nock";
import getHowDidYouHearAboutUsSourceDropdownValues from "./getHowDidYouHearAboutUsSourceDropdownValues";
import { getHowDidYouHearAboutUsSourcesSuccess } from "../../actionCreators/howDidYouHearAboutUsSourceActionCreators";

jest.mock("../../../common/auth/getAccessToken");

describe("getIntakeSourceDropdownValues", () => {
  const dispatch = jest.fn();
  configureInterceptors({ dispatch });
  const hostname = "http://localhost";
  const apiRoute = "/api/how-did-you-hear-about-us-sources";

  beforeEach(async () => {
    getAccessToken.mockImplementation(() => "token");
  });

  test("it fetches how did you hear about us sources and dispatches them", async () => {
    const responseBody = [["Facebook", 1], ["Friend", 2], ["NOIPM Website", 3]];

    nock(hostname)
      .get(apiRoute)
      .reply(200, responseBody);

    await getHowDidYouHearAboutUsSourceDropdownValues()(dispatch);
    expect(dispatch).toHaveBeenCalledWith(
      getHowDidYouHearAboutUsSourcesSuccess(responseBody)
    );
  });
});
