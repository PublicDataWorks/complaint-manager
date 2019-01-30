import Civilian from "../../testUtilities/civilian";
import { push } from "connected-react-router";
import { startSubmit, stopSubmit } from "redux-form";
import getAccessToken from "../../auth/getAccessToken";
import {
  closeEditCivilianDialog,
  createCivilianSuccess
} from "../../actionCreators/casesActionCreators";
import createCivilian from "./createCivilian";
import nock from "nock";
import configureInterceptors from "../../axiosInterceptors/interceptors";
import config from "../../config/config";
import RaceEthnicity from "../../testUtilities/raceEthnicity";
import { CIVILIAN_FORM_NAME } from "../../../sharedUtilities/constants";
import { snackbarSuccess } from "../../actionCreators/snackBarActionCreators";

const hostname = config["test"].hostname;

jest.mock("../../auth/getAccessToken", () => jest.fn(() => "TEST_TOKEN"));
jest.mock("../../actionCreators/casesActionCreators", () => ({
  createCivilianSuccess: jest.fn(() => ({
    type: "MOCK_EDIT_SUCCESS"
  })),
  closeEditCivilianDialog: jest.fn(() => ({
    type: "MOCK_CLOSE"
  }))
}));

describe("civilian creation", function() {
  const dispatch = jest.fn();
  let civilian;

  beforeEach(() => {
    const raceEthnicity = new RaceEthnicity.Builder()
      .defaultRaceEthnicity()
      .build();
    civilian = {
      ...new Civilian.Builder()
        .defaultCivilian()
        .withCreatedAt("sometime")
        .build(),
      raceEthnicityId: raceEthnicity.id
    };
    configureInterceptors({ dispatch });
    dispatch.mockClear();
  });

  test("should redirect to login if not authenticated", async () => {
    getAccessToken.mockImplementationOnce(() => false);
    await createCivilian(civilian)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(push(`/login`));
  });

  test("should dispatch success, close dialog and stop submit when civilian created successfully", async () => {
    nock(hostname, {
      reqheaders: {
        "Content-Type": "application/json",
        Authorization: `Bearer TEST_TOKEN`
      }
    })
      .post(`/api/cases/${civilian.caseId}/civilians`, civilian)
      .reply(201, [civilian]);

    await createCivilian(civilian)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(startSubmit(CIVILIAN_FORM_NAME));
    expect(dispatch).toHaveBeenCalledWith(createCivilianSuccess([civilian]));
    expect(dispatch).toHaveBeenCalledWith(
      snackbarSuccess("Civilian was successfully created")
    );
    expect(dispatch).toHaveBeenCalledWith(closeEditCivilianDialog());
    expect(dispatch).toHaveBeenCalledWith(stopSubmit(CIVILIAN_FORM_NAME));
  });

  test("should dispatch failure and stop submit when civilian creation fails", async () => {
    nock(hostname, {
      reqheaders: {
        "Content-Type": "application/json",
        Authorization: `Bearer TEST_TOKEN`
      }
    })
      .post(`/api/cases/${civilian.caseId}/civilians`, civilian)
      .reply(500);

    await createCivilian(civilian)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(startSubmit(CIVILIAN_FORM_NAME));
    expect(dispatch).toHaveBeenCalledWith(stopSubmit(CIVILIAN_FORM_NAME));
  });
});
