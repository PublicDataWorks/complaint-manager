import generateExport from "./generateExportJob";
import nock from "nock";
import {
  addBackgroundJobFailure,
  clearCurrentExportJob,
  generateExportSuccess
} from "../../actionCreators/exportActionCreators";
import getAccessToken from "../../auth/getAccessToken";
import configureInterceptors from "../../interceptors";
jest.mock("../../auth/getAccessToken", () => jest.fn(() => "token"));
import { push } from "connected-react-router";

describe("generateExportJob", () => {
  const mockedDispatch = jest.fn();
  configureInterceptors({dispatch: mockedDispatch});
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

    expect(mockedDispatch).toHaveBeenCalledWith(addBackgroundJobFailure());
    expect(mockedDispatch).toHaveBeenCalledWith(clearCurrentExportJob());
  });
});
