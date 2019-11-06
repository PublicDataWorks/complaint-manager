import nock from "nock";
import configureInterceptors from "../../../common/axiosInterceptors/interceptors";
import { snackbarSuccess } from "../../../complaintManager/actionCreators/snackBarActionCreators";
import { closeCreateDialog } from "../../../common/actionCreators/createDialogActionCreators";
import { DialogTypes } from "../../../common/actionCreators/dialogTypes";
import createMatrix from "./createMatrix";
import { createMatrixSuccess } from "../../actionCreators/matrixActionCreators";
import { CREATE_MATRIX_FORM_NAME } from "../../../../sharedUtilities/constants";
import { reset, startSubmit, stopSubmit } from "redux-form";

jest.mock("../../../common/auth/getAccessToken", () =>
  jest.fn(() => "TEST_TOKEN")
);

describe("createCase", () => {
  const dispatch = jest.fn();

  beforeEach(() => {
    configureInterceptors({ dispatch });
    dispatch.mockClear();
  });

  test("should dispatch success and close the dialog when matrix created successfully", async () => {
    const creationDetails = {
      pibControlNumber: "2019-1234-R",
      firstReviewer: "Jacob",
      secondReviewer: "Karan"
    };

    const responseBody = {
      matrixId: 1,
      pibControlNumber: "2019-1234-R",
      firstReviewer: "Jacob",
      secondReviewer: "Karan"
    };

    nock("http://localhost", {
      reqheaders: {
        "Content-Type": "application/json",
        Authorization: `Bearer TEST_TOKEN`
      }
    })
      .post("/api/matrix-manager/matrices", creationDetails)
      .reply(201, responseBody);

    await createMatrix(creationDetails)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(startSubmit(CREATE_MATRIX_FORM_NAME));
    expect(dispatch).toHaveBeenCalledWith(
      snackbarSuccess(
        `Matrix was successfully created: PIB Control #${creationDetails.pibControlNumber}`
      )
    );
    expect(dispatch).toHaveBeenCalledWith(createMatrixSuccess(responseBody));
    expect(dispatch).toHaveBeenCalledWith(
      closeCreateDialog(DialogTypes.MATRIX)
    );
    expect(dispatch).toHaveBeenCalledWith(stopSubmit(CREATE_MATRIX_FORM_NAME));
  });

  test("should dispatch error and close dialog when matrix fails to be created", async () => {
    nock("http://localhost")
      .get("/api/users")
      .replyWithError({
        message: "Oh no",
        code: "THE WORST ERROR"
      });

    await createMatrix()(dispatch);
    expect(dispatch).toHaveBeenCalledWith(stopSubmit(CREATE_MATRIX_FORM_NAME));
    expect(dispatch).not.toHaveBeenCalledWith(reset(CREATE_MATRIX_FORM_NAME));
  });
});
