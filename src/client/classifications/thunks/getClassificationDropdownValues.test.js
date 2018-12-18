import getAccessToken from "../../auth/getAccessToken";
import { push } from "connected-react-router";
import nock from "nock";
import { getClassificationsSuccess } from "../../actionCreators/classificationActionCreators";
import getClassficationDropdownValues from "./getClassificationDropdownValues";
import { snackbarError } from "../../actionCreators/snackBarActionCreators";
jest.mock("../../auth/getAccessToken");

describe("getClassificationDropdownValues", () => {
  const dispatch = jest.fn();

  test("it redirects to login if no token", async () => {
    getAccessToken.mockImplementation(() => false);
    await getClassficationDropdownValues()(dispatch);
    expect(dispatch).toHaveBeenCalledWith(push("/login"));
  });

  test("it fetches classification values and dispatches them", async () => {
    getAccessToken.mockImplementation(() => "token");
    const responseBody = [
      [1, "BWC – Body Worn Camera"],
      [2, "FDI – Formal Disciplinary Investigation"]
    ];

    nock("http://localhost")
      .get("/api/classifications")
      .reply(200, responseBody);

    await getClassficationDropdownValues()(dispatch);
    expect(dispatch).toHaveBeenCalledWith(
      getClassificationsSuccess(responseBody)
    );
  });

  test("it dispatches failure when api call fails", async () => {
    getAccessToken.mockImplementation(() => "token");
    const responseBody = [
      [1, "BWC – Body Worn Camera"],
      [2, "FDI – Formal Disciplinary Investigation"]
    ];

    nock("http://localhost")
      .get("/api/classifications")
      .reply(500);

    await getClassficationDropdownValues()(dispatch);
    expect(dispatch).toHaveBeenCalledWith(
      snackbarError(
        "Something went wrong and the classifications were not loaded. Please try again."
      )
    );
  });
});
