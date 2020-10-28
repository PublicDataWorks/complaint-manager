import configureInterceptors from "../../../../common/axiosInterceptors/interceptors";
import getAccessToken from "../../../../common/auth/getAccessToken";
import { ALLEGATION_OPTIONS } from "../../../../../sharedUtilities/constants";
import nock from "nock";
import getOfficerHistoryOptionsRadioButtonValues from "./getOfficerHistoryOptionsRadioButtonValues";
import { getOfficerHistoryOptionsRadioButtonValuesSuccess } from "../../../actionCreators/officerHistoryOptionsActionCreator";

jest.mock("../../../../common/auth/getAccessToken");

describe("getOfficerHistoryOptionsRadioButtonValues", function() {
  const dispatch = jest.fn();
  configureInterceptors({ dispatch });
  const hostname = "http://localhost";
  const apiRoute = "/api/officer-history-options";

  beforeEach(async () => {
    getAccessToken.mockImplementation(() => "token");
  });

  test("it fetches officer history options and dispatches them", async () => {
    const responseBody = [
      [1, ALLEGATION_OPTIONS.NO_NOTEWORTHY_HISTORY],
      [2, ALLEGATION_OPTIONS.RECRUIT],
      [3, ALLEGATION_OPTIONS.NOTEWORTHY_HISTORY]
    ];

    nock(hostname)
      .get(apiRoute)
      .reply(200, responseBody);

    await getOfficerHistoryOptionsRadioButtonValues()(dispatch);
    expect(dispatch).toHaveBeenCalledWith(
      getOfficerHistoryOptionsRadioButtonValuesSuccess(responseBody)
    );
  });
});
