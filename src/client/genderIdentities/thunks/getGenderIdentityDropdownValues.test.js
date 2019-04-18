import getAccessToken from "../../auth/getAccessToken";
import configureInterceptors from "../../axiosInterceptors/interceptors";
import nock from "nock";
import getGenderIdentityDropdownValues from "./getGenderIdentityDropdownValues";
import { getGenderIdentitiesSuccess } from "../../actionCreators/genderIdentityActionCreators";

jest.mock("../../auth/getAccessToken");

describe("getGenderIdentityDropdownValues", () => {
  const dispatch = jest.fn();
  configureInterceptors({ dispatch });

  beforeEach(async () => {
    getAccessToken.mockImplementation(() => "token");
  });

  test("it fetches gender identity values and dispatches them", async () => {
    const responseBody = [["Female", 1], ["Trans Female", 2], ["Other", 3]];

    nock("http://localhost")
      .get("/api/gender-identities")
      .reply(200, responseBody);

    await getGenderIdentityDropdownValues()(dispatch);

    expect(dispatch).toHaveBeenCalledWith(
      getGenderIdentitiesSuccess(responseBody)
    );
  });
});
