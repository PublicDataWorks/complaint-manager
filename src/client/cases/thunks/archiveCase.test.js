import configureInterceptors from "../../axiosInterceptors/interceptors";
import nock from "nock";
import { closeArchiveCaseDialog } from "../../actionCreators/casesActionCreators";
import archiveCase from "./archiveCase";

jest.mock("../../auth/getAccessToken", () => jest.fn(() => "TEST_TOKEN"));

describe("archiveCase", () => {
  const dispatch = jest.fn();

  beforeEach(() => {
    configureInterceptors({ dispatch });
    dispatch.mockClear();
  });

  test("should dispatch close archive dialog when case archived successfully", async () => {
    const existingCase = {
      id: 2
    };

    nock("http://localhost", {
      reqheaders: {
        Authorization: `Bearer TEST_TOKEN`
      }
    })
      .put(`/api/cases/${existingCase.id}/archive`)
      .reply(200, {});

    await archiveCase(existingCase.id)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(closeArchiveCaseDialog());
  });
});
