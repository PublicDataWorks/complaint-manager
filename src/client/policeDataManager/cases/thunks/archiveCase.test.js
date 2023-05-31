import configureInterceptors from "../../../common/axiosInterceptors/interceptors";
import nock from "nock";
import { archiveCaseSuccess } from "../../actionCreators/casesActionCreators";
import archiveCase from "./archiveCase";
import { snackbarSuccess } from "../../actionCreators/snackBarActionCreators";
import { ARCHIVE_CASE_FORM_NAME } from "../../../../sharedUtilities/constants";
import { startSubmit, stopSubmit } from "redux-form";

jest.mock("../../../common/auth/getAccessToken", () =>
  jest.fn(() => "TEST_TOKEN")
);

describe("archiveCase", () => {
  const dispatch = jest.fn();
  const existingCase = {
    id: 2
  };

  beforeEach(() => {
    configureInterceptors({ dispatch });
    dispatch.mockClear();
  });

  test("should dispatch get case details success when case archived successfully", async () => {
    const updatedCaseResponse = { caseId: existingCase.id, isArchived: false };

    nock("http://localhost")
      .delete(`/api/cases/${existingCase.id}`)
      .reply(200, updatedCaseResponse);

    await archiveCase(existingCase.id)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(archiveCaseSuccess());
  });

  test("should dispatch success when case archived successfully", async () => {
    nock("http://localhost")
      .delete(`/api/cases/${existingCase.id}`)
      .reply(200, {});

    await archiveCase(existingCase.id)(dispatch);
    expect(dispatch).toHaveBeenCalledWith(startSubmit(ARCHIVE_CASE_FORM_NAME));

    expect(dispatch).toHaveBeenCalledWith(
      snackbarSuccess("Case was successfully archived")
    );
    expect(dispatch).toHaveBeenCalledWith(stopSubmit(ARCHIVE_CASE_FORM_NAME));
  });

  test("should dispatch stopSubmit when archiving case fails", async () => {
    nock("http://localhost")
      .delete(`/api/cases/${existingCase.id}`)
      .reply(500, {});

    await archiveCase(existingCase.id)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(stopSubmit(ARCHIVE_CASE_FORM_NAME));
  });
});
