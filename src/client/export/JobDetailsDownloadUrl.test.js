import React from "react";
import { shallow } from "enzyme";
import { JobDetails } from "./JobDetails";
jest.mock("react-dom");
import ReactDOM from "react-dom";

const JOB_ID = 19;

describe("Job Detail", () => {
  let jobDetails;

  const anchorNode = { click: jest.fn() };

  beforeEach(() => {
    ReactDOM.findDOMNode.mockImplementation(() => anchorNode);
    jobDetails = shallow(
      <JobDetails
        jobId={JOB_ID}
        key={JOB_ID}
        getExportJob={jest.fn()}
        clearCurrentExportJob={jest.fn()}
      />
    );
  });

  test("display download url when url is available", () => {
    jobDetails.setProps({ downloadUrl: "url" });

    const downloadAnchor = jobDetails.find('[data-test="downloadUrl"]');
    expect(downloadAnchor.type()).toEqual("a");
    expect(downloadAnchor.props().href).toEqual("url");
    expect(anchorNode.click).toHaveBeenCalled();
  });
});
