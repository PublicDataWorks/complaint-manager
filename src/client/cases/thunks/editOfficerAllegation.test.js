import editOfficerAllegation from "./editOfficerAllegation";
import nock from "nock";
import { push } from "react-router-redux";
import getAccessToken from "../../auth/getAccessToken";
import {
  snackbarError,
  snackbarSuccess
} from "../../actionCreators/snackBarActionCreators";
import { updateAllegationDetailsSuccess } from "../../actionCreators/casesActionCreators";

jest.mock("../../auth/getAccessToken", () => jest.fn(() => "TEST_TOKEN"));

describe("editOfficerAllegation thunk", () => {
  test("should redirect to login if no token given", async () => {
    getAccessToken.mockImplementationOnce(() => null);
    const mockDispatch = jest.fn();
    const allegationChanges = { details: "new details" };

    await editOfficerAllegation(allegationChanges)(mockDispatch);

    expect(mockDispatch).toHaveBeenCalledWith(push("/login"));
  });

  test("should dispatch success when officer allegation edit is successful", async () => {
    const allegationChanges = { id: 1, details: "new details" };
    const mockDispatch = jest.fn();

    const updatedCase = { details: "foo" };

    nock("http://localhost", {
      "Content-Type": "application/json",
      Authorization: `Bearer TEST_TOKEN`
    })
      .put(
        `/api/officers-allegations/${allegationChanges.id}`,
        JSON.stringify(allegationChanges)
      )
      .reply(200, updatedCase);

    await editOfficerAllegation(allegationChanges)(mockDispatch);

    expect(mockDispatch).toHaveBeenCalledWith(
      snackbarSuccess("Allegation successfully updated")
    );
    expect(mockDispatch).toHaveBeenCalledWith(
      updateAllegationDetailsSuccess(allegationChanges.id, updatedCase)
    );
  });

  test("should dispatch failure when officer allegation does not exist", async () => {
    const allegationChanges = { id: 1, details: "new details" };
    const mockDispatch = jest.fn();

    nock("http://localhost", {
      "Content-Type": "application/json",
      Authorization: `Bearer TEST_TOKEN`
    })
      .put(
        `/api/officers-allegations/${allegationChanges.id}`,
        JSON.stringify(allegationChanges)
      )
      .reply(404);

    await editOfficerAllegation(allegationChanges)(mockDispatch);

    expect(mockDispatch).toHaveBeenCalledWith(
      snackbarError(
        "Something went wrong on our end and the allegation was not updated."
      )
    );
  });

  test("should dispatch failure when the server returns 500", async () => {
    const allegationChanges = { id: 1, details: "new details" };
    const mockDispatch = jest.fn();

    nock("http://localhost", {
      "Content-Type": "application/json",
      Authorization: `Bearer TEST_TOKEN`
    })
      .put(
        `/api/officers-allegations/${allegationChanges.id}`,
        JSON.stringify(allegationChanges)
      )
      .reply(500);

    await editOfficerAllegation(allegationChanges)(mockDispatch);

    expect(mockDispatch).toHaveBeenCalledWith(
      snackbarError(
        "Something went wrong on our end and the allegation was not updated."
      )
    );
  });
});
