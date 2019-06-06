import nock from "nock";
import createCaseTag from "./createCaseTag";
import {
  closeCaseTagDialog,
  createCaseTagSuccess
} from "../../actionCreators/casesActionCreators";
import configureInterceptors from "../../axiosInterceptors/interceptors";

jest.mock("../../auth/getAccessToken", () => jest.fn(() => "TEST_TOKEN"));

describe("createCaseTag", () => {
  const dispatch = jest.fn();

  beforeEach(() => {
    configureInterceptors({ dispatch });
    dispatch.mockClear();
  });

  test("should dispatch success when case note added successfully", async () => {
    const caseTag = "Some super special awesome tag";
    const caseId = 234;

    const submitValues = {
      caseTag: caseTag,
      caseId: caseId
    };

    const responseBody = {
      caseTags: [caseTag]
    };

    nock("http://localhost", {
      reqheaders: {
        "Content-Type": "application/json",
        Authorization: `Bearer TEST_TOKEN`
      }
    })
      .post(`/api/cases/${caseId}/case-tags`, { caseTag: caseTag })
      .reply(201, responseBody);

    await createCaseTag(submitValues)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(
      createCaseTagSuccess(responseBody.caseTags)
    );
    expect(dispatch).toHaveBeenCalledWith(closeCaseTagDialog());
  });
});
