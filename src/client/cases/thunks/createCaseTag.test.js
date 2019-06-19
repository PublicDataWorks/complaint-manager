import nock from "nock";
import createCaseTag from "./createCaseTag";
import {
  closeCaseTagDialog,
  createCaseTagSuccess
} from "../../actionCreators/casesActionCreators";
import configureInterceptors from "../../axiosInterceptors/interceptors";
import { getTagsSuccess } from "../../actionCreators/tagActionCreators";
import { snackbarSuccess } from "../../actionCreators/snackBarActionCreators";

jest.mock("../../auth/getAccessToken", () => jest.fn(() => "TEST_TOKEN"));

describe("createCaseTag", () => {
  const dispatch = jest.fn();

  beforeEach(() => {
    configureInterceptors({ dispatch });
    dispatch.mockClear();
  });

  test("should dispatch create and get tag success when case tag added successfully", async () => {
    const caseTagValue = "Some super special awesome tag";
    const caseId = 234;

    const submitValues = {
      caseTagValue: caseTagValue
    };

    const requestBody = { tagName: caseTagValue };

    const responseBody = {
      caseTags: [[caseTagValue, 1]],
      tags: [[caseTagValue, 1]]
    };

    nock("http://localhost", {
      reqheaders: {
        "Content-Type": "application/json",
        Authorization: `Bearer TEST_TOKEN`
      }
    })
      .post(`/api/cases/${caseId}/case-tags`, requestBody)
      .reply(201, responseBody);

    await createCaseTag(submitValues, caseId)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(
      createCaseTagSuccess(responseBody.caseTags)
    );
    expect(dispatch).toHaveBeenCalledWith(getTagsSuccess(responseBody.tags));
    expect(dispatch).toHaveBeenCalledWith(closeCaseTagDialog());
    expect(dispatch).toHaveBeenCalledWith(
      snackbarSuccess("Case tag was successfully added")
    );
  });
});
