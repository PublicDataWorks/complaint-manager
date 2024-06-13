import getHousingUnits from "./getHousingUnits";
import configureInterceptors from "../../../common/axiosInterceptors/interceptors";
import getAccessToken from "../../../common/auth/getAccessToken";
import nock from "nock";
import { getHousingUnitsSuccess } from "../../actionCreators/housingUnitActionCreator";

jest.mock("../../../common/auth/getAccessToken")

describe(" get the housing units", () => {
  const dispatch = jest.fn();
  const facilityId = 1;
  configureInterceptors({ dispatch });

  beforeEach(async () => {
    getAccessToken.mockImplementation(() => "token");
  });

  test("it fetches housing unit values and dispatches them", async () => {
    const responseBody = [
      ["Housing Unit 1", 1],
      ["Housing Unit 2", 13]
    ];

    nock("http://localhost").get("/api/housing-units").query({facilityId: facilityId}).reply(200, responseBody);

    await getHousingUnits(1)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(getHousingUnitsSuccess(responseBody));
  });
});
