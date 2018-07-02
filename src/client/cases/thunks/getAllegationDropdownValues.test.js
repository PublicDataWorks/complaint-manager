import getAccessToken from "../../auth/getAccessToken";
import getAllegationDropdownValues from "./getAllegationDropdownValues";
import { push } from "react-router-redux";
import nock from "nock";
import {
  getAllegationsFailed,
  getAllegationsSuccess
} from "../../actionCreators/allegationsActionCreators";

jest.mock("../../auth/getAccessToken", () => jest.fn(() => "TEST_TOKEN"));

describe("getAllegationDropdownValues", function() {
  const dispatch = jest.fn();
  test("should redirect to login if no access token", async () => {
    getAccessToken.mockImplementationOnce(() => false);

    await getAllegationDropdownValues()(dispatch);

    expect(dispatch).toHaveBeenCalledWith(push("/login"));
  });

  test("should redirect dispatch success on 200 response", async () => {
    dispatch.mockClear();

    const responseBody = { some: "response" };
    nock("http://localhost")
      .get(`/api/allegations`)
      .reply(200, responseBody);

    await getAllegationDropdownValues()(dispatch);
    expect(dispatch).toHaveBeenCalledWith(getAllegationsSuccess(responseBody));
  });

  test("should redirect dispatch failure on 500 response", async () => {
    dispatch.mockClear();

    nock("http://localhost", {
      reqheaders: {
        "Content-Type": "application/json",
        Authorization: `Bearer TEST_TOKEN`
      }
    })
      .get(`/api/allegations`)
      .reply(500);

    await getAllegationDropdownValues()(dispatch);
    expect(dispatch).toHaveBeenCalledWith(getAllegationsFailed());
  });
});
