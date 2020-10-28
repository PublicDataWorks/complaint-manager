import generateExportJob from "./generateExportJob";
import nock from "nock";
import {
  clearCurrentExportJob,
  generateExportSuccess
} from "../../actionCreators/exportActionCreators";
import configureInterceptors from "../../../common/axiosInterceptors/interceptors";
jest.mock("../../../common/auth/getAccessToken", () => jest.fn(() => "token"));

describe("generateExportJob", () => {
  const responseData = { jobId: 4 };
  const mockedDispatch = jest.fn();
  configureInterceptors({ dispatch: mockedDispatch });
  const url = "/url";
  const emptyDateRange = {};
  test("dispatches success when response returns successfully", async () => {
    nock("http://localhost")
      .get(url)
      .reply(200, responseData);

    await generateExportJob(url, emptyDateRange)(mockedDispatch);

    expect(mockedDispatch).toHaveBeenCalledWith(
      generateExportSuccess(responseData)
    );
  });

  test("clears job when call returns error code", async () => {
    nock("http://localhost")
      .get(url)
      .reply(500);

    await generateExportJob(url, emptyDateRange)(mockedDispatch);

    expect(mockedDispatch).toHaveBeenCalledWith(clearCurrentExportJob());
  });

  test("sends request to uri with query params when date range provided", async () => {
    const encodedUri = "/encodedUri";
    const dateRange = {
      exportStartDate: "date",
      exportEndDate: "date"
    };
    nock("http://localhost")
      .get(`${url}?exportStartDate=date&exportEndDate=date`)
      .reply(200, responseData);

    await generateExportJob(url, dateRange)(mockedDispatch);

    expect(mockedDispatch).toHaveBeenCalledWith(
      generateExportSuccess(responseData)
    );
  });
});
