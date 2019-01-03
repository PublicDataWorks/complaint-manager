import getAllegationDropdownValues from "./getAllegationDropdownValues";
import nock from "nock";
import {
  getAllegationsFailed,
  getAllegationsSuccess
} from "../../actionCreators/allegationsActionCreators";
import configureInterceptors from "../../axiosInterceptors/interceptors";

jest.mock("../../auth/getAccessToken", () => jest.fn(() => "TEST_TOKEN"));

describe("getAllegationDropdownValues", function() {
  const dispatch = jest.fn();
  configureInterceptors({ dispatch });

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
        Authorization: `Bearer TEST_TOKEN`
      }
    })
      .get(`/api/allegations`)
      .reply(500);

    await getAllegationDropdownValues()(dispatch);
    expect(dispatch).toHaveBeenCalledWith(getAllegationsFailed());
  });
});
