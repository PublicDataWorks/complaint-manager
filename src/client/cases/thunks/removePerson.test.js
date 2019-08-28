import nock from "nock";
import removePerson from "./removePerson";
import {
  closeRemovePersonDialog,
  removePersonFailure,
  removePersonSuccess
} from "../../actionCreators/casesActionCreators";
import configureInterceptors from "../../axiosInterceptors/interceptors";
import { startSubmit, stopSubmit } from "redux-form";
import { REMOVE_PERSON_FORM_NAME } from "../../../sharedUtilities/constants";
import { snackbarSuccess } from "../../actionCreators/snackBarActionCreators";
import _ from "lodash";

jest.mock("../../auth/getAccessToken", () => jest.fn(() => "TEST_TOKEN"));

describe("removePerson", () => {
  let dispatch = jest.fn();
  const personTypeForDisplay = "Civilian";
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

    expect(dispatch).toHaveBeenCalledWith(startSubmit(REMOVE_PERSON_FORM_NAME));
    expect(dispatch).toHaveBeenCalledWith(stopSubmit(REMOVE_PERSON_FORM_NAME));
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

    expect(dispatch).toHaveBeenCalledWith(startSubmit(REMOVE_PERSON_FORM_NAME));
    expect(dispatch).toHaveBeenCalledWith(removePersonSuccess(response));
    expect(dispatch).toHaveBeenCalledWith(
      snackbarSuccess(`${personTypeForDisplay} was successfully removed`)
    );
    expect(dispatch).toHaveBeenCalledWith(closeRemovePersonDialog());
    expect(dispatch).toHaveBeenCalledWith(stopSubmit(REMOVE_PERSON_FORM_NAME));
  });
});
