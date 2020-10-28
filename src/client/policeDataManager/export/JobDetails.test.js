import React from "react";
import { Provider } from "react-redux";
import createConfiguredStore from "../../createConfiguredStore";
import { mount } from "enzyme";
import getExportJob from "./thunks/getExportJob";
import {
  clearCurrentExportJob,
  exportJobStarted
} from "../actionCreators/exportActionCreators";
import JobDetails from "./JobDetails";

jest.mock("./thunks/getExportJob");

const JOB_ID = 19;

describe("Job Detail", () => {
  let jobDetails, dispatchSpy, store;

  beforeEach(() => {
    getExportJob.mockImplementation(id => () => ({ type: "something" }));

    store = createConfiguredStore();
    dispatchSpy = jest.spyOn(store, "dispatch");

    jobDetails = mount(
      <Provider store={store}>
        <JobDetails jobId={JOB_ID} key={JOB_ID} />
      </Provider>
    );
  });

  test("show progress when job is still in progress", () => {
    store.dispatch(exportJobStarted());
    jobDetails.update();

    const waiting = jobDetails.find('[data-testid="waitingForJob"]');
    expect(waiting.type()).toEqual("div");
  });

  test("hide waiting UI when job has failed", () => {
    store.dispatch(exportJobStarted());
    store.dispatch(clearCurrentExportJob());

    jobDetails.update();

    const waiting = jobDetails.find('[data-testid="waitingForJob"]');
    expect(waiting.type()).toEqual("div");
    const waitingStyle = waiting.children().props().style;
    expect(waitingStyle).toEqual({ display: "none" });
  });
});
