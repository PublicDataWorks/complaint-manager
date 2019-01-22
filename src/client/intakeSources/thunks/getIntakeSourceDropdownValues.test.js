import configureInterceptors from "../../axiosInterceptors/interceptors";
import getAccessToken from "../../auth/getAccessToken";
import nock from "nock";
import getIntakeSourceDropdownValues from "./getIntakeSourceDropdownValues";
import { getIntakeSourcesSuccess } from "../../actionCreators/intakeSourceActionCreators";

jest.mock("../../auth/getAccessToken");

describe("getIntakeSourceDropdownValues", () => {
  const dispatch = jest.fn();
  configureInterceptors({ dispatch });
  const hostname = "http://localhost";
  const apiRoute = "/api/intake-sources";

  beforeEach(async () => {
    getAccessToken.mockImplementation(() => "token");
  });

  test("it fetches intake source and dispatches them", async () => {
    const responseBody = [[1, "Email"], [2, "Facebook"], [3, "NOIPM Website"]];

    nock(hostname)
      .get(apiRoute)
      .reply(200, responseBody);

    await getIntakeSourceDropdownValues()(dispatch);
    expect(dispatch).toHaveBeenCalledWith(
      getIntakeSourcesSuccess(responseBody)
    );
  });
});
