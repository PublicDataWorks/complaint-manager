import nock from "nock";
import { getCasesSuccess } from "../../actionCreators/casesActionCreators";
import getCases from "./getCases";
import getAccessToken from "../../auth/getAccessToken";
import { push } from "react-router-redux";

jest.mock("../../auth/getAccessToken", () => jest.fn(() => "TEST_TOKEN"));

describe("getCases", () => {
  const dispatch = jest.fn();
  const responseBody = { cases: ["a case"] };

  beforeEach(() => {
    getAccessToken.mockClear();
    dispatch.mockClear();
  });

  test("should dispatch success when cases retrieved", async () => {
    nock("http://localhost", {
      reqheaders: {
        "Content-Type": "application/json",
        Authorization: `Bearer TEST_TOKEN`
      }
    })
      .get("/api/cases")
      .reply(200, responseBody);

    await getCases()(dispatch);

    expect(dispatch).toHaveBeenCalledWith(getCasesSuccess(responseBody.cases));
  });

  test("should not dispatch success and should redirect when 401 returned", async () => {
    nock("http://localhost", {
      reqheaders: {
        "Content-Type": "application/json",
        Authorization: `Bearer TEST_TOKEN`
      }
    })
      .get("/api/cases")
      .reply(401, responseBody);

    await getCases()(dispatch);

    expect(dispatch).not.toHaveBeenCalledWith(
      getCasesSuccess(responseBody.cases)
    );
    expect(dispatch).toHaveBeenCalledWith(push(`/login`));
  });

  test("should redirect immediately if token missing", async () => {
    getAccessToken.mockImplementation(() => false);

    nock("http://localhost", {
      reqheaders: {
        "Content-Type": "application/json",
        Authorization: `Bearer false`
      }
    })
      .get("/api/cases")
      .reply(200, responseBody);

    await getCases()(dispatch);

    expect(dispatch).not.toHaveBeenCalledWith(
      getCasesSuccess(responseBody.cases)
    );
    expect(dispatch).toHaveBeenCalledWith(push(`/login`));
  });
});
