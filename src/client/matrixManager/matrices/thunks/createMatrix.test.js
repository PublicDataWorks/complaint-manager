import nock from "nock";
import configureInterceptors from "../../../axiosInterceptors/interceptors";
import { snackbarSuccess } from "../../../actionCreators/snackBarActionCreators";
import { closeCreateDialog } from "../../../common/actionCreators/createDialogActionCreators";
import { DialogTypes } from "../../../common/actionCreators/dialogTypes";
import createMatrix from "./createMatrix";
import { createMatrixSuccess } from "../../actionCreators/matrixActionCreators";

jest.mock("../../../auth/getAccessToken", () => jest.fn(() => "TEST_TOKEN"));

describe("createCase", () => {
  const dispatch = jest.fn();

  beforeEach(() => {
    configureInterceptors({ dispatch });
    dispatch.mockClear();
  });

  test("should dispatch success and close the dialog when case created successfully", async () => {
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

    expect(dispatch).toHaveBeenCalledWith(
      snackbarSuccess(
        `Matrix was successfully created: PIB Control #${creationDetails.pibControlNumber}`
      )
    );
    expect(dispatch).toHaveBeenCalledWith(createMatrixSuccess(responseBody));
    expect(dispatch).toHaveBeenCalledWith(
      closeCreateDialog(DialogTypes.MATRIX)
    );
  });
});
