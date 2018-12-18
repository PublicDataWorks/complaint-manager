import nock from "nock";
import updateNarrative from "./updateNarrative";
import {
  updateNarrativeFailure,
  updateNarrativeSuccess
} from "../../actionCreators/casesActionCreators";
import getAccessToken from "../../auth/getAccessToken";
import { push } from "react-router-redux";
import configureInterceptors from "../../interceptors";

jest.mock("../../auth/getAccessToken", () => jest.fn(() => "TEST_TOKEN"));

describe("updateNarrative", () => {
  const dispatch = jest.fn();
  configureInterceptors({dispatch})
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
  });

  test("should dispatch failure when narrative update fails", async () => {
    nock("http://localhost", {
      reqheaders: {
        "Content-Type": "application/json",
        Authorization: "Bearer TEST_TOKEN"
      }
    })
      .put(`/api/cases/${updateDetails.id}/narrative`, {
        narrativeDetails: updateDetails.narrativeDetails,
        narrativeSummary: updateDetails.narrativeSummary
      })
      .reply(500);

    await updateNarrative(updateDetails)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(updateNarrativeFailure());
  });
});
