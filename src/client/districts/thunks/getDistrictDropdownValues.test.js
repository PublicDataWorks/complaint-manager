import configureInterceptors from "../../axiosInterceptors/interceptors";
import getAccessToken from "../../auth/getAccessToken";
import nock from "nock";
import getDistrictDropdownValues from "./getDistrictDropdownValues";
import { getDistrictsSuccess } from "../../actionCreators/districtsActionCreators";

jest.mock("../../auth/getAccessToken");

describe("getDistrictDropdownValues", () => {
  const dispatch = jest.fn();
  configureInterceptors({ dispatch });

  beforeEach(async () => {
    getAccessToken.mockImplementation(() => "token");
  });

  test("it fetches district values and dispatches them", async () => {
    const responseBody = [["1st District", 1], ["13th District", 13]];

    nock("http://localhost")
      .get("/api/districts")
      .reply(200, responseBody);

    await getDistrictDropdownValues()(dispatch);

    expect(dispatch).toHaveBeenCalledWith(getDistrictsSuccess(responseBody));
  });
});
