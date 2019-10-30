import nock from "nock";
import updateNarrative from "./updateNarrative";
import { updateNarrativeSuccess } from "../../actionCreators/casesActionCreators";
import configureInterceptors from "../../../common/axiosInterceptors/interceptors";
import { snackbarSuccess } from "../../actionCreators/snackBarActionCreators";

jest.mock("../../../common/auth/getAccessToken", () =>
  jest.fn(() => "TEST_TOKEN")
);

describe("updateNarrative", () => {
  const dispatch = jest.fn();
  configureInterceptors({ dispatch });
  const updateDetails = {
    id: 1,
    narrativeDetails: "Some case narrative details",
    narrativeSummary: "Some case narrative summary"
  };

  beforeEach(() => {
    dispatch.mockClear();
  });

  test("should dispatch success when narrative updated successfully", async () => {
    const dispatch = jest.fn();

    const responseBody = {
      id: 1,
      narrativeDetails: "Some case narrative details",
      narrativeSummary: "Some case narrative summary"
    };

    nock("http://localhost")
      .put(`/api/cases/${updateDetails.id}/narrative`, {
        narrativeDetails: updateDetails.narrativeDetails,
        narrativeSummary: updateDetails.narrativeSummary
      })
      .reply(200, responseBody);

    await updateNarrative(updateDetails)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(updateNarrativeSuccess(responseBody));
    expect(dispatch).toHaveBeenCalledWith(
      snackbarSuccess("Narrative was successfully updated")
    );
  });
});
