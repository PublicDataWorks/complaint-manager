import editOfficerAllegation from "./editOfficerAllegation";
import nock from "nock";
import { snackbarSuccess } from "../../actionCreators/snackBarActionCreators";
import { updateAllegationDetailsSuccess } from "../../actionCreators/casesActionCreators";
import configureInterceptors from "../../../common/axiosInterceptors/interceptors";

jest.mock("../../../common/auth/getAccessToken", () =>
  jest.fn(() => "TEST_TOKEN")
);

describe("editOfficerAllegation thunk", () => {
  test("should dispatch success when officer allegation edit is successful", async () => {
    const allegationChanges = { id: 1, details: "new details" };
    const mockDispatch = jest.fn();
    configureInterceptors({ dispatch: mockDispatch });

    const updatedCase = { details: "new details" };

    const caseId = 23;
    nock("http://localhost", {
      "Content-Type": "application/json",
      Authorization: `Bearer TEST_TOKEN`
    })
      .put(
        `/api/cases/${caseId}/officers-allegations/${allegationChanges.id}`,
        updatedCase
      )
      .reply(200, updatedCase);

    await editOfficerAllegation(allegationChanges, caseId)(mockDispatch);

    expect(mockDispatch).toHaveBeenCalledWith(
      snackbarSuccess("Allegation was successfully updated")
    );
    expect(mockDispatch).toHaveBeenCalledWith(
      updateAllegationDetailsSuccess(allegationChanges.id, updatedCase)
    );
  });
});
