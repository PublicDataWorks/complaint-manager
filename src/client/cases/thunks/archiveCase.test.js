import configureInterceptors from "../../axiosInterceptors/interceptors";
import nock from "nock";
import { closeArchiveCaseDialog } from "../../actionCreators/casesActionCreators";
import archiveCase from "./archiveCase";
import { snackbarSuccess } from "../../actionCreators/snackBarActionCreators";
import { ARCHIVE_CASE_FORM_NAME } from "../../../sharedUtilities/constants";
import { startSubmit, stopSubmit } from "redux-form";

jest.mock("../../auth/getAccessToken", () => jest.fn(() => "TEST_TOKEN"));

describe("archiveCase", () => {
  const dispatch = jest.fn();
  const existingCase = {
    id: 2
  };

  beforeEach(() => {
    configureInterceptors({ dispatch });
    dispatch.mockClear();
  });

  test("should dispatch close archive dialog when case archived successfully", async () => {
    nock("http://localhost", {
      reqheaders: {
        Authorization: `Bearer TEST_TOKEN`
      }
    })
      .delete(`/api/cases/${existingCase.id}`)
      .reply(200, {});

    await archiveCase(existingCase.id)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(closeArchiveCaseDialog());
  });

  test("should dispatch success when case archived successfully", async () => {
    nock("http://localhost", {
      reqheaders: {
        Authorization: `Bearer TEST_TOKEN`
      }
    })
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
    nock("http://localhost", {
      reqheaders: {
        Authorization: `Bearer TEST_TOKEN`
      }
    })
      .delete(`/api/cases/${existingCase.id}`)
      .reply(500, {});

    await archiveCase(existingCase.id)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(stopSubmit(ARCHIVE_CASE_FORM_NAME));
  });
});
