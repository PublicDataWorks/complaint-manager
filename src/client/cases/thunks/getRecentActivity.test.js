import getRecentActivity from "./getRecentActivity";
import nock from "nock";
import getAccessToken from "../../auth/getAccessToken";
import { getRecentActivitySuccess } from "../../actionCreators/casesActionCreators";
import { push } from "react-router-redux";

jest.mock("../../auth/getAccessToken", () => jest.fn(() => "TEST_TOKEN"));

describe("getRecentActivity", () => {
  const dispatch = jest.fn();
  const caseId = 1;
  const responseBody = [
    {
      id: 1,
      caseId: caseId,
      user: "tuser",
      action: "Created case"
    }
  ];
  beforeEach(() => {
    dispatch.mockClear();
  });

  test("should dispatch success when recent activity fetched", async () => {
    nock("http://localhost")
      .get(`/api/cases/${caseId}/recent-activity`)
      .reply(200, responseBody);

    await getRecentActivity(caseId)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(
      getRecentActivitySuccess(responseBody)
    );
  });

  test("should redirect to login when no token present", async () => {
    getAccessToken.mockImplementationOnce(() => null);

    await getRecentActivity(caseId)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(push("/login"));
  });
});
