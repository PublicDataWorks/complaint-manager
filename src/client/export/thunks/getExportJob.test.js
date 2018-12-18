import nock from "nock";
import getExportJob from "./getExportJob";
import {
  addBackgroundJobFailure,
  exportJobCompleted,
  clearCurrentExportJob
} from "../../actionCreators/exportActionCreators";
import {
  EXPORT_JOB_MAX_REFRESH_TIMES,
  EXPORT_JOB_REFRESH_INTERVAL_MS
} from "../../../sharedUtilities/constants";
import getAccessToken from "../../auth/getAccessToken";
import { push } from "react-router-redux";
import configureInterceptors from "../../interceptors";
jest.mock("../../auth/getAccessToken", () => jest.fn(() => "TEST_TOKEN"));
jest.useFakeTimers();

describe("Get Export Job by id", () => {
  const jobId = 19;
  const mockedDispatch = jest.fn();
  configureInterceptors({dispatch: mockedDispatch})

  test("job Complete should trigger job complete action", async () => {
    nock("http://localhost")
      .get(`/api/export/job/${jobId}`)
      .reply(200, { state: "complete", downLoadUrl: "some url" });

    await getExportJob(jobId, 1)(mockedDispatch);

    expect(mockedDispatch).toHaveBeenCalledWith(exportJobCompleted("some url"));
  });

  test("job failure should trigger clear job and bg job failure", async () => {
    nock("http://localhost")
      .get(`/api/export/job/${jobId}`)
      .reply(200, { state: "failed" });

    await getExportJob(jobId, 1)(mockedDispatch);

    expect(mockedDispatch).toHaveBeenCalledWith(clearCurrentExportJob());
    expect(mockedDispatch).toHaveBeenCalledWith(addBackgroundJobFailure());
  });

  test("should trigger clear job and bg job failure if reach max retry", async () => {
    nock("http://localhost")
      .get(`/api/export/job/${jobId}`)
      .reply(200, { state: "active" });

    await getExportJob(jobId, EXPORT_JOB_MAX_REFRESH_TIMES + 1)(mockedDispatch);

    expect(mockedDispatch).toHaveBeenCalledWith(clearCurrentExportJob());
    expect(mockedDispatch).toHaveBeenCalledWith(addBackgroundJobFailure());
  });

  test("should trigger clear job and bg job failure if reach max retry", async () => {
    nock("http://localhost")
      .get(`/api/export/job/${jobId}`)
      .reply(200, { state: "active" });

    await getExportJob(jobId, 1)(mockedDispatch);

    expect(setTimeout).toHaveBeenLastCalledWith(
      expect.any(Function),
      EXPORT_JOB_REFRESH_INTERVAL_MS
    );
  });

  test("should dispatch failure message and clear out job if call fails", async () => {
    nock("http://localhost")
      .get(`/api/export/job/${jobId}`)
      .reply(500);
    await getExportJob(jobId, 1)(mockedDispatch);
    expect(mockedDispatch).toHaveBeenCalledWith(clearCurrentExportJob());
    expect(mockedDispatch).toHaveBeenCalledWith(addBackgroundJobFailure());
  });
});
