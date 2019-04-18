import getAccessToken from "../../auth/getAccessToken";
import nock from "nock";
import { getClassificationsSuccess } from "../../actionCreators/classificationActionCreators";
import getClassficationDropdownValues from "./getClassificationDropdownValues";
import configureInterceptors from "../../axiosInterceptors/interceptors";

jest.mock("../../auth/getAccessToken");

describe("getClassificationDropdownValues", () => {
  const dispatch = jest.fn();
  configureInterceptors({ dispatch });

  test("it fetches classification values and dispatches them", async () => {
    getAccessToken.mockImplementation(() => "token");
    const responseBody = [
      ["BWC – Body Worn Camera", 1],
      ["FDI – Formal Disciplinary Investigation", 2]
    ];

    nock("http://localhost")
      .get("/api/classifications")
      .reply(200, responseBody);

    await getClassficationDropdownValues()(dispatch);
    expect(dispatch).toHaveBeenCalledWith(
      getClassificationsSuccess(responseBody)
    );
  });
});
