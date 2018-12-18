import { push } from "react-router-redux";
import getAccessToken from "../../auth/getAccessToken";
import createOfficerAllegation from "./createOfficerAllegation";
import nock from "nock";
import {
  snackbarError,
  snackbarSuccess
} from "../../actionCreators/snackBarActionCreators";
import { createOfficerAllegationSuccess } from "../../actionCreators/allegationsActionCreators";
import configureInterceptors from "../../interceptors";

jest.mock("../../auth/getAccessToken", () => jest.fn(() => "TEST_TOKEN"));

describe("create officer allegation", function() {
  const dispatch = jest.fn();
  const formValues = { allegationId: 54, details: "allegation details" };
  const caseId = 15;
  const caseOfficerId = 3;
  const callBackFunction = jest.fn();

  beforeEach(() => {
    configureInterceptors({dispatch})
    dispatch.mockClear();
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

    await createOfficerAllegation(
      formValues,
      caseId,
      caseOfficerId,
      callBackFunction
    )(dispatch);
    expect(dispatch).toHaveBeenCalledWith(
      snackbarError(
        "Something went wrong and the allegation was not added. Please try again."
      )
    );
  });

  test("should dispatch success and call the callback when officer allegation added successfully", async () => {
    const responseBody = {
      accusedOfficers: [
        {
          allegations: [
            {
              details: "details",
              allegation: {
                id: 5,
                rule: "rule",
                paragraph: "paragraph",
                directive: "directive"
              }
            }
          ]
        }
      ]
    };

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
      .reply(201, responseBody);

    await createOfficerAllegation(
      formValues,
      caseId,
      caseOfficerId,
      callBackFunction
    )(dispatch);

    expect(dispatch).toHaveBeenCalledWith(
      snackbarSuccess("Allegation was successfully added")
    );
    expect(callBackFunction).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledWith(
      createOfficerAllegationSuccess(responseBody)
    );
  });
});
