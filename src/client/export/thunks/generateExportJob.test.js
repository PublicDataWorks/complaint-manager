import generateExport from "./generateExportJob";
import nock from "nock";
import {
  clearCurrentExportJob,
  generateExportSuccess
} from "../../actionCreators/exportActionCreators";
import configureInterceptors from "../../axiosInterceptors/interceptors";
jest.mock("../../auth/getAccessToken", () => jest.fn(() => "token"));

describe("generateExportJob", () => {
  const mockedDispatch = jest.fn();
  configureInterceptors({ dispatch: mockedDispatch });
  const url = "/url";

  test("dispatches success when response returns successfully", async () => {
    const responseData = { jobId: 4 };
    nock("http://localhost")
      .get(url)
      .reply(200, responseData);

    await generateExport(url)(mockedDispatch);

    expect(mockedDispatch).toHaveBeenCalledWith(
      generateExportSuccess(responseData)
    );
  });

  test("dispatches snackbar error and clears job when call returns error code", async () => {
    nock("http://localhost")
      .get(url)
      .reply(500);

    await generateExport(url)(mockedDispatch);

    expect(mockedDispatch).toHaveBeenCalledWith(clearCurrentExportJob());
  });
});
