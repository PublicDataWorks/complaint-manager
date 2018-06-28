//TODO can we extract token management, failure dispatch, etc into something common?
import nock from "nock";
import { push } from "react-router-redux";
import editCivilian from "./editCivilian";
import Civilian from "../../testUtilities/civilian";
import {
  closeEditDialog,
  editCivilianFailed,
  editCivilianSuccess
} from "../../actionCreators/casesActionCreators";
import getAccessToken from "../../auth/getAccessToken";

jest.mock("../../auth/getAccessToken", () => jest.fn(() => "TEST_TOKEN"));
jest.mock("../../actionCreators/casesActionCreators", () => ({
  editCivilianSuccess: jest.fn(() => ({ type: "MOCK_EDIT_SUCCESS" })),
  closeEditDialog: jest.fn(() => ({ type: "MOCK_CLOSE" })),
  editCivilianFailed: jest.fn(() => ({ type: "MOCK_EDIT_FAILED" }))
}));

describe("edit civilian thunk", () => {
  const dispatch = jest.fn();
  const civilian = new Civilian.Builder()
    .defaultCivilian()
    .withCreatedAt("some time")
    .build();
  const responseCivilians = [civilian];
  const responseBody = {};

  beforeEach(() => {
    dispatch.mockClear();
  });

  test("should redirect immediately if token missing", async () => {
    getAccessToken.mockImplementationOnce(() => false);
    await editCivilian()(dispatch);

    expect(dispatch).toHaveBeenCalledWith(editCivilianFailed());
    expect(dispatch).toHaveBeenCalledWith(push(`/login`));
  });

  test("should redirect to login if unauthorized", async () => {
    nock("http://localhost", {
      "Content-Type": "application/json",
      Authorization: `Bearer TEST_TOKEN`
    })
      .put(`/api/civilian/${civilian.id}`, civilian)
      .reply(401, responseBody);

    await editCivilian(civilian)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(push(`/login`));
  });

  test("should dispatch error action if we get an unrecognized response", async () => {
    nock("http://localhost", {})
      .put(`/api/civilian/${civilian.id}`, civilian)
      .reply(500, responseBody);

    await editCivilian(civilian)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(editCivilianFailed());
  });

  test("should dispatch success when civilian edit was successful", async () => {
    nock("http://localhost", {
      "Content-Type": "application/json",
      Authorization: `Bearer TEST_TOKEN`
    })
      .put(`/api/civilian/${civilian.id}`, civilian)
      .reply(200, responseCivilians);

    await editCivilian(civilian)(dispatch);
    expect(editCivilianSuccess).toHaveBeenCalledWith(responseCivilians);
    expect(dispatch).toHaveBeenCalledWith(editCivilianSuccess());
    expect(dispatch).toHaveBeenCalledWith(closeEditDialog());
  });
});
