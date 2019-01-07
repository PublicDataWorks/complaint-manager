import configureInterceptors from "../../axiosInterceptors/interceptors";
import getAccessToken from "../../auth/getAccessToken";
import nock from "nock";
import getRaceEthnicityDropdownValues from "./getRaceEthnicityDropdownValues";
import { getRaceEthnicitiesSuccess } from "../../actionCreators/raceEthnicityActionCreators";
import { snackbarError } from "../../actionCreators/snackBarActionCreators";

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
    const responseBody = [[1, "Filipino"], [2, "Samoan"], [3, "Unknown"]];

    nock(hostname)
      .get(apiRoute)
      .reply(200, responseBody);

    await getRaceEthnicityDropdownValues()(dispatch);
    expect(dispatch).toHaveBeenCalledWith(
      getRaceEthnicitiesSuccess(responseBody)
    );
  });

  test("it dispatches failure when api call fails", async () => {
    nock(hostname)
      .get(apiRoute)
      .reply(500);

    await getRaceEthnicityDropdownValues()(dispatch);

    expect(dispatch).toHaveBeenCalledWith(
      snackbarError(
        "Something went wrong and the race & ethnicities were not loaded. Please try again."
      )
    );
  });
});
