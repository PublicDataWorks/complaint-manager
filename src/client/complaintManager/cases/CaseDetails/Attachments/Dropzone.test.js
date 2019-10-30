import React from "react";
import { mount } from "enzyme";
import Dropzone from "./Dropzone";
import DropzoneComponent from "react-dropzone-component";

jest.mock("../../../../common/auth/getAccessToken", () =>
  jest.fn(() => "TEST_TOKEN")
);

describe("Dropzone", () => {
  let dropzoneInstance, testCaseId, wrapper;

  beforeEach(() => {
    testCaseId = 100;

    wrapper = mount(
      <Dropzone
        caseId={testCaseId}
        errorMessage=""
        uploadAttachmentSuccess={jest.fn()}
        dropDuplicateFile={jest.fn()}
        snackbarSuccess={jest.fn()}
        snackbarError={jest.fn()}
        removeDropzoneFile={jest.fn()}
      />
    );

    dropzoneInstance = wrapper.find(DropzoneComponent).instance();
  });

  test("should have correct post-url config when mounted", () => {
    // TODO: pull the hostname from config? or delete this test?
    expect(dropzoneInstance.props.config.postUrl).toEqual(
      `http://localhost/api/cases/${testCaseId}/attachments`
    );
  });

  test("should have maxFiles, addRemoveLinks, and acceptedFile types when mounted", () => {
    // TODO: Is testing the config like this valuable?
    expect(dropzoneInstance.props.djsConfig.maxFiles).toEqual(1);
    expect(dropzoneInstance.props.djsConfig.addRemoveLinks).toEqual(true);
  });

  test("should disable upload button by default", () => {
    const submitButton = wrapper
      .find('[data-test="attachmentUploadButton"]')
      .last();

    expect(submitButton.props()).toHaveProperty("disabled", true);
  });

  test("should disable upload button when attachment absent, no upload ongoing, and description present", () => {
    const inputField = wrapper
      .find('[data-test="attachmentDescriptionInput"]')
      .last();

    inputField.simulate("change", { target: { value: "some description" } });

    const submitButton = wrapper
      .find('[data-test="attachmentUploadButton"]')
      .last();
    expect(submitButton.props()).toHaveProperty("disabled", true);
  });

  test("should disable upload button when description absent, no upload ongoing, and attachment present", () => {
    wrapper.setState({
      attachmentValid: true,
      attachmentDescription: "",
      uploadInProgress: false
    });

    const submitButton = wrapper
      .find('[data-test="attachmentUploadButton"]')
      .last();
    expect(submitButton.props()).toHaveProperty("disabled", true);
  });

  test("should enable upload button when description and attachment present, no upload ongoing", () => {
    wrapper.setState({
      attachmentValid: true,
      attachmentDescription: "this is a description",
      uploadInProgress: false
    });

    const submitButton = wrapper
      .find('[data-test="attachmentUploadButton"]')
      .last();
    expect(submitButton.props()).toHaveProperty("disabled", false);
  });

  test("should disable upload button when description and attachment present, and upload ongoing", () => {
    wrapper.setState({
      attachmentValid: true,
      attachmentDescription: "this is a description",
      uploadInProgress: true
    });

    const submitButton = wrapper
      .find('[data-test="attachmentUploadButton"]')
      .last();
    expect(submitButton.props()).toHaveProperty("disabled", true);
  });
});
