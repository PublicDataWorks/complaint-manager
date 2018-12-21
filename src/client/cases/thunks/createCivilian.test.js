import Civilian from "../../testUtilities/civilian";
import { push } from "react-router-redux";
import getAccessToken from "../../auth/getAccessToken";
import {
  closeEditDialog,
  createCivilianFailure,
  createCivilianSuccess
} from "../../actionCreators/casesActionCreators";
import createCivilian from "./createCivilian";
import config from "../../config/config";
import nock from "nock";
import configureInterceptors from "../../axiosInterceptors/interceptors";

const hostname = config["test"].hostname;

jest.mock("../../auth/getAccessToken", () => jest.fn(() => "TEST_TOKEN"));
jest.mock("../../actionCreators/casesActionCreators", () => ({
  createCivilianSuccess: jest.fn(() => ({
    type: "MOCK_EDIT_SUCCESS"
  })),
  createCivilianFailure: jest.fn(() => ({
    type: "MOCK_EDIT_FAILDED"
  })),
  closeEditDialog: jest.fn(() => ({
    type: "MOCK_CLOSE"
  }))
}));

describe("civilian creation", function() {
  const dispatch = jest.fn();
  const civilian = new Civilian.Builder()
    .defaultCivilian()
    .withCreatedAt("sometime")
    .build();

  beforeEach(() => {
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
