import nock from "nock";
import getPersonTypes from "./getPersonTypes";
import configureInterceptors from "../../../common/axiosInterceptors/interceptors";
import { GET_PERSON_TYPES } from "../../../../sharedUtilities/constants";

jest.mock("../../../common/auth/getAccessToken", () => () => "TEST_TOKEN");

describe("getPersonTypes thunk", function () {
  test("should dispatch success when person types fetched successfully", async () => {
    const mockDispatch = jest.fn();
    configureInterceptors({ dispatch: mockDispatch });
    const personTypes = [{ key: "CIVLIAN" }];
    nock("http://localhost").get(`/api/person-types`).reply(200, personTypes);

    await getPersonTypes()(mockDispatch);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: GET_PERSON_TYPES,
      payload: personTypes
    });
  });
});
