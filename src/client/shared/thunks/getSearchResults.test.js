import getSearchResults from "./getSearchResults";
import { push } from "react-router-redux";
import getAccessToken from "../../auth/getAccessToken";
import nock from "nock";
import { snackbarError } from "../../actionCreators/snackBarActionCreators";
import { searchSuccess } from "../../actionCreators/searchActionCreators";

jest.mock("../../auth/getAccessToken");

describe("getSearchResults", () => {
  const searchCriteria = {
    firstName: "Zoe",
    lastName: "Monster",
    district: "1st District"
  };
  const dispatch = jest.fn();
  const token = "token";

  const resourceToSearch = "resources";

  beforeEach(() => {
    dispatch.mockClear();
  });
  test("redirects to login if no token", async () => {
    getAccessToken.mockImplementation(() => null);
    await getSearchResults(searchCriteria, resourceToSearch)(dispatch);
    expect(dispatch).toHaveBeenCalledWith(push("/login"));
  });

  test("dispatches failure when error response", async () => {
    nock("http://localhost/", {
      reqheaders: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    })
      .get(`/api/${resourceToSearch}/search`)
      .query(searchCriteria)
      .reply(500);
    getAccessToken.mockImplementation(() => token);
    await getSearchResults(searchCriteria, resourceToSearch)(dispatch);
    expect(dispatch).toHaveBeenCalledWith(
      snackbarError(
        "Something went wrong on our end and we could not complete your search."
      )
    );
  });

  test("dispatches searchSuccess", async () => {
    const responseBody = [{ firstName: "Bob" }];
    nock("http://localhost/", {
      reqheaders: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    })
      .get(`/api/${resourceToSearch}/search`)
      .query(searchCriteria)
      .reply(200, responseBody);
    getAccessToken.mockImplementation(() => token);
    await getSearchResults(searchCriteria, resourceToSearch)(dispatch);
    expect(dispatch).toHaveBeenCalledWith(searchSuccess(responseBody));
  });

  test("dispatches searchSuccess with pagination", async () => {
    const responseBody = [{ firstName: "Bob" }];
    nock("http://localhost/", {
      reqheaders: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    })
      .get(`/api/${resourceToSearch}/search`)
      .query(searchCriteria)
      .reply(200, responseBody);
    getAccessToken.mockImplementation(() => token);
    const paginating = true;
    const newPage = 3;
    await getSearchResults(
      searchCriteria,
      resourceToSearch,
      paginating,
      newPage
    )(dispatch);
    expect(dispatch).toHaveBeenCalledWith(searchSuccess(responseBody, newPage));
  });

  test("redirects to login when api call returns 401", async () => {
    nock("http://localhost/", {
      reqheaders: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    })
      .get(`/api/${resourceToSearch}/search`)
      .query(searchCriteria)
      .reply(401);

    getAccessToken.mockImplementation(() => token);
    await getSearchResults(searchCriteria, resourceToSearch)(dispatch);
    expect(dispatch).toHaveBeenCalledWith(push("/login"));
  });
});
