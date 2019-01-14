import configureInterceptors from "../../axiosInterceptors/interceptors";
import nock from "nock";
import {
  archiveCaseFailure,
  archiveCaseSuccess,
  closeArchiveCaseDialog
} from "../../actionCreators/casesActionCreators";
import archiveCase from "./archiveCase";
import {
  snackbarError,
  snackbarSuccess
} from "../../actionCreators/snackBarActionCreators";

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

    expect(dispatch).toHaveBeenCalledWith(
      snackbarSuccess("Case was successfully archived")
    );
  });

  test("should dispatch archiveCaseFailure when archiving case fails", async () => {
    nock("http://localhost", {
      reqheaders: {
        Authorization: `Bearer TEST_TOKEN`
      }
    })
      .delete(`/api/cases/${existingCase.id}`)
      .reply(500, {});

    await archiveCase(existingCase.id)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(
      snackbarError(
        "Something went wrong and the case was not archived. Please try again."
      )
    );
  });
});
