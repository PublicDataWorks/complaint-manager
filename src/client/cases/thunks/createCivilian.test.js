import Civilian from "../../testUtilities/civilian";
import { push } from "react-router-redux";
import getAccessToken from "../../auth/getAccessToken";
import {
  closeEditDialog,
  createCivilianFailure,
  createCivilianSuccess
} from "../../actionCreators/casesActionCreators";
import createCivilian from "./createCivilian";
import nock from "nock";
import configureInterceptors from "../../axiosInterceptors/interceptors";
import config from "../../config/config";
import RaceEthnicity from "../../testUtilities/raceEthnicity";

const hostname = config["test"].hostname;

jest.mock("../../auth/getAccessToken", () => jest.fn(() => "TEST_TOKEN"));
jest.mock("../../actionCreators/casesActionCreators", () => ({
  createCivilianSuccess: jest.fn(() => ({
    type: "MOCK_EDIT_SUCCESS"
  })),
  createCivilianFailure: jest.fn(() => ({
    type: "MOCK_EDIT_FAILED"
  })),
  closeEditDialog: jest.fn(() => ({
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

    expect(dispatch).toHaveBeenCalledWith(createCivilianFailure());
    expect(dispatch).toHaveBeenCalledWith(push(`/login`));
  });

  test("should dispatch success & close dialog when civilian created successfully", async () => {
    nock(hostname, {
      reqheaders: {
        "Content-Type": "application/json",
        Authorization: `Bearer TEST_TOKEN`
      }
    })
      .post("/api/civilian", civilian)
      .reply(201, [civilian]);

    await createCivilian(civilian)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(createCivilianSuccess([civilian]));
    expect(dispatch).toHaveBeenCalledWith(closeEditDialog());
  });

  test("should dispatch failure when civilian creation fails", async () => {
    nock(hostname, {
      reqheaders: {
        "Content-Type": "application/json",
        Authorization: `Bearer TEST_TOKEN`
      }
    })
      .post("/api/civilian", civilian)
      .reply(500);

    await createCivilian(civilian)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(createCivilianFailure());
  });
});
