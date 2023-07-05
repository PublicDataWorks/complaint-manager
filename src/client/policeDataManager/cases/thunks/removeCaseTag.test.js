import removeCaseTag from "./removeCaseTag";
import nock from "nock";
import { startSubmit, stopSubmit } from "redux-form";
import configureInterceptors from "../../../common/axiosInterceptors/interceptors";
import { REMOVE_CASE_TAG_FORM_NAME } from "../../../../sharedUtilities/constants";
import { snackbarSuccess } from "../../actionCreators/snackBarActionCreators";
import { removeCaseTagSuccess } from "../../actionCreators/casesActionCreators";

jest.mock("../../../common/auth/getAccessToken", () =>
  jest.fn(() => "TEST_TOKEN")
);

describe("removeCaseTag", () => {
  test("should dispatch success when case tag removed successfully", async () => {
    const dispatch = jest.fn();
    configureInterceptors({ dispatch });

    const caseId = 1;
    const caseTagId = 2;
    const tagId = 1;

    const responseBody = [
      {
        id: 1,
        caseId: caseId,
        tagId: tagId
      }
    ];

    nock("http://localhost")
      .delete(`/api/cases/${caseId}/case-tags/${caseTagId}`)
      .reply(200, responseBody);

    await removeCaseTag(caseId, caseTagId)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(
      startSubmit(REMOVE_CASE_TAG_FORM_NAME)
    );
    expect(dispatch).toHaveBeenCalledWith(removeCaseTagSuccess(responseBody));
    expect(dispatch).toHaveBeenCalledWith(
      snackbarSuccess("Case tag was successfully removed")
    );
    expect(dispatch).toHaveBeenCalledWith(
      stopSubmit(REMOVE_CASE_TAG_FORM_NAME)
    );
  });

  test("should dispatch failure when remove case tag fails", async () => {
    const dispatch = jest.fn();
    configureInterceptors({ dispatch });

    const caseId = 1;
    const caseNoteId = 2;
    const caseTagId = 2;

    nock("http://localhost")
      .delete(`/api/cases/${caseId}/case-tags/${caseTagId}`)
      .reply(500);

    await removeCaseTag(caseId, caseNoteId)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(
      startSubmit(REMOVE_CASE_TAG_FORM_NAME)
    );
    expect(dispatch).toHaveBeenCalledWith(
      stopSubmit(REMOVE_CASE_TAG_FORM_NAME)
    );
  });
});
