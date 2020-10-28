import getAccessToken from "../../../common/auth/getAccessToken";
import editIncidentDetails from "./editIncidentDetails";
import nock from "nock";
import {
  updateIncidentDetailsFailure,
  updateIncidentDetailsSuccess
} from "../../actionCreators/casesActionCreators";
import configureInterceptors from "../../../common/axiosInterceptors/interceptors";
import { snackbarSuccess } from "../../actionCreators/snackBarActionCreators";

jest.mock("../../../common/auth/getAccessToken");

describe("editIncidentDetails", () => {
  const dispatch = jest.fn();
  const closeDialogCallback = jest.fn();

  beforeEach(() => {
    configureInterceptors({ dispatch });
    dispatch.mockClear();
  });

  test("should dispatch success and close dialog when incident is successfully edited", async () => {
    const updateDetails = {
      id: 17,
      firstContactDate: new Date(),
      incidentDate: new Date(),
      incidentTime: "16:00:00"
    };

    const response = {};
    getAccessToken.mockImplementationOnce(() => "TEST_TOKEN");

    nock("http://localhost")
      .put(`/api/cases/${updateDetails.id}`, JSON.stringify(updateDetails))
      .reply(200, response);

    await editIncidentDetails(updateDetails, closeDialogCallback)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(
      updateIncidentDetailsSuccess(response)
    );
    expect(dispatch).toHaveBeenCalledWith(
      snackbarSuccess("Incident details were successfully updated")
    );
    expect(closeDialogCallback).toHaveBeenCalled();
  });
});
