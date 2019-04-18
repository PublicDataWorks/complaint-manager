import configureInterceptors from "../../axiosInterceptors/interceptors";
import getAccessToken from "../../auth/getAccessToken";
import nock from "nock";
import getRaceEthnicityDropdownValues from "./getRaceEthnicityDropdownValues";
import { getRaceEthnicitiesSuccess } from "../../actionCreators/raceEthnicityActionCreators";

jest.mock("../../auth/getAccessToken");

describe("getRaceEthnicityDropdownValues", () => {
  const dispatch = jest.fn();
  configureInterceptors({ dispatch });
  const hostname = "http://localhost";
  const apiRoute = "/api/race-ethnicities";

  beforeEach(async () => {
    getAccessToken.mockImplementation(() => "token");
  });

  test("it fetches race ethnicity and dispatches them", async () => {
    const responseBody = [["Filipino", 1], ["Samoan", 2], ["Unknown", 3]];

    nock(hostname)
      .get(apiRoute)
      .reply(200, responseBody);

    await getRaceEthnicityDropdownValues()(dispatch);
    expect(dispatch).toHaveBeenCalledWith(
      getRaceEthnicitiesSuccess(responseBody)
    );
  });
});
