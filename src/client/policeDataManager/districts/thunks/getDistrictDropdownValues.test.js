import configureInterceptors from "../../../common/axiosInterceptors/interceptors";
import getAccessToken from "../../../common/auth/getAccessToken";
import nock from "nock";
import getDistrictDropdownValues from "./getDistrictDropdownValues";
import { getDistrictsSuccess } from "../../actionCreators/districtsActionCreators";

jest.mock("../../../common/auth/getAccessToken");

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
