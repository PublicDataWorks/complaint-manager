import { push } from "react-router-redux";
import getAccessToken from "../../auth/getAccessToken";
import createOfficerAllegation from "./createOfficerAllegation";
import nock from "nock";
import {
  snackbarError,
  snackbarSuccess
} from "../../actionCreators/snackBarActionCreators";

jest.mock("../../auth/getAccessToken", () => jest.fn(() => "TEST_TOKEN"));

describe("create officer allegation", function() {
  const dispatch = jest.fn();
  const formValues = { allegationId: 54, details: "allegation details" };
  const caseId = 15;
  const caseOfficerId = 3;

  beforeEach(() => {
    dispatch.mockClear();
  });

  test("should redirect to login if token missing", async () => {
    getAccessToken.mockImplementationOnce(() => false);
    await createOfficerAllegation(formValues, caseId, caseOfficerId)(dispatch);
    expect(dispatch).toHaveBeenCalledWith(push(`/login`));
  });

  test("should not dispatch success if unauthorized and redirect", async () => {
    nock("http://localhost", {
      reqheaders: {
        "Content-Type": "application/json",
        Authorization: `Bearer TEST_TOKEN`
      }
    })
      .post(
        `/api/cases/${caseId}/cases-officers/${caseOfficerId}/officers-allegations`,
        formValues,
        caseId,
        caseOfficerId
      )
      .reply(401);

    await createOfficerAllegation(formValues, caseId, caseOfficerId)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(push(`/login`));
  });

  test("should dispatch failure when create officer allegation fails", async () => {
    nock("http://localhost", {
      reqheaders: {
        "Content-Type": "application/json",
        Authorization: `Bearer TEST_TOKEN`
      }
    })
      .post(
        `/api/cases/${caseId}/cases-officers/${caseOfficerId}/officers-allegations`,
        formValues,
        caseId,
        caseOfficerId
      )
      .reply(500);

    await createOfficerAllegation(formValues, caseId, caseOfficerId)(dispatch);
    expect(dispatch).toHaveBeenCalledWith(
      snackbarError(
        "Something went wrong on our end and your allegation was not added. Please try again."
      )
    );
  });

  test("should dispatch success when officer allegation added successfully", async () => {
    nock("http://localhost", {
      reqheaders: {
        "Content-Type": "application/json",
        Authorization: `Bearer TEST_TOKEN`
      }
    })
      .post(
        `/api/cases/${caseId}/cases-officers/${caseOfficerId}/officers-allegations`,
        formValues,
        caseId,
        caseOfficerId
      )
      .reply(201);

    await createOfficerAllegation(formValues, caseId, caseOfficerId)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(
      snackbarSuccess("Allegation successfully added to officer.")
    );
  });
});
