import React from "react";
import { Provider } from "react-redux";
import createConfiguredStore from "../createConfiguredStore";
import { mount } from "enzyme";
import getExportJob from "./thunks/getExportJob";

jest.mock("./thunks/getExportJob");

import { getExportJobSuccess } from "../actionCreators/exportActionCreators";
import JobDetails from "./JobDetails";

const JOB_ID = 19;

describe("Job Detail", () => {
  let jobDetails, dispatchSpy, store;

  beforeEach(() => {
    getExportJob.mockImplementation(id => {});
    store = createConfiguredStore();
    dispatchSpy = jest.spyOn(store, "dispatch");

    jobDetails = mount(
      <Provider store={store}>
        <JobDetails jobId={JOB_ID} />
      </Provider>
    );
  });

  test("wait for job when it is not complete or failed", () => {
    const exportJob = { id: JOB_ID, state: "", result: {} };
    store.dispatch(getExportJobSuccess(exportJob));

    const waiting = jobDetails.find('[data-test="waitingForJob"]');
    expect(waiting.type()).toEqual("div");
  });

  test("display download url when job is completed", () => {
    const completeJob = {
      id: JOB_ID,
      state: "complete",
      result: { downloadUrl: "some url" }
    };
    store.dispatch(getExportJobSuccess(completeJob));

    jobDetails.update();

    const downloadAnchor = jobDetails.find('[data-test="downloadUrl"]');
    expect(downloadAnchor.type()).toEqual("a");
  });

  test("hide waiting UI when job has failed", () => {
    const completeJob = { id: JOB_ID, state: "failed", result: {} };
    store.dispatch(getExportJobSuccess(completeJob));

    jobDetails.update();

    const waiting = jobDetails.find('[data-test="waitingForJob"]');
    expect(waiting.type()).toEqual("div");
    const waitingStyle = waiting.children().props().style;
    expect(waitingStyle).toEqual({ display: "none" });
  });
});
