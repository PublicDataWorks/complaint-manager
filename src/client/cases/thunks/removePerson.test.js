import nock from "nock";
import removePerson from "./removePerson";
import {
  closeRemovePersonDialog,
  removePersonFailure,
  removePersonSuccess
} from "../../actionCreators/casesActionCreators";
import configureInterceptors from "../../axiosInterceptors/interceptors";

jest.mock("../../auth/getAccessToken", () => jest.fn(() => "TEST_TOKEN"));

describe("removePerson", () => {
  let dispatch = jest.fn();
  const personTypeForDisplay = "civilian";
  const personType = "civilians";
  const caseId = 123;
  const id = 345;
  const personDetails = {
    caseId: caseId,
    id: id,
    personType: personType
  };

  beforeEach(() => {
    configureInterceptors({ dispatch });
    dispatch.mockClear();
  });

  test("should dispatch error action if we get an unrecognized response", async () => {
    nock("http://localhost", {})
      .delete(`/api/cases/${caseId}/${personType}/${id}`)
      .reply(500);

    await removePerson(personDetails)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(
      removePersonFailure(personTypeForDisplay)
    );
  });

  test("should dispatch success when civilian removed successfully", async () => {
    const response = {
      some: "response"
    };
    nock("http://localhost", {
      "Content-Type": "application/json",
      Authorization: `Bearer TEST_TOKEN`
    })
      .delete(`/api/cases/${caseId}/${personType}/${id}`)
      .reply(200, response);

    await removePerson(personDetails)(dispatch);
    expect(dispatch).toHaveBeenCalledWith(
      removePersonSuccess(response, personTypeForDisplay)
    );
    expect(dispatch).toHaveBeenCalledWith(closeRemovePersonDialog());
  });
});
