import { mockLocalStorage } from "../../../../mockLocalStorage";
import nock from "nock";
import removeAttachment from "./removeAttachment";
import { removeAttachmentSuccess } from "../../actionCreators/attachmentsActionCreators";
import configureInterceptors from "../../../common/axiosInterceptors/interceptors";
import { snackbarSuccess } from "../../actionCreators/snackBarActionCreators";
jest.mock("../../../common/auth/getAccessToken", () =>
  jest.fn(() => "TEST_TOKEN")
);

describe("remove attachment", () => {
  let mockCaseReference, mockFileName, dispatch, caseDetails;
  beforeEach(() => {
    mockCaseReference = 109;
    mockFileName = "sample.text";
    caseDetails = { fileName: "sample.text" };
    dispatch = jest.fn();
    configureInterceptors({ dispatch });
    mockLocalStorage();
  });

  test("should dispatch success when attachment removal was successful", async () => {
    nock("http://localhost", {
      "Content-Type": "application/json",
      Authorization: `Bearer TEST_TOKEN`
    })
      .delete(`/api/cases/${mockCaseReference}/attachments/${mockFileName}`)
      .reply(200, caseDetails);

    await removeAttachment(mockCaseReference, mockFileName, jest.fn())(
      dispatch
    );
    expect(dispatch).toHaveBeenCalledWith(removeAttachmentSuccess(caseDetails));
    expect(dispatch).toHaveBeenCalledWith(
      snackbarSuccess("File was successfully removed")
    );
  });

  test("should dispatch close dialog when attachment was successful", async () => {
    nock("http://localhost", {
      "Content-Type": "application/json",
      Authorization: `Bearer TEST_TOKEN`
    })
      .delete(`/api/cases/${mockCaseReference}/attachments/${mockFileName}`)
      .reply(200, caseDetails);

    const callback = jest.fn();
    await removeAttachment(mockCaseReference, mockFileName, callback)(dispatch);
    expect(callback).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledWith(
      snackbarSuccess("File was successfully removed")
    );
  });
});
