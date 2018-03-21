import React from "react";
import { mount } from "enzyme";
import Dropzone from "./Dropzone";
import DropzoneComponent from 'react-dropzone-component'
import { containsText } from "../../../../testHelpers";

jest.mock("../../../auth/getAccessToken", () => jest.fn(() => "TEST_TOKEN"))

describe('Dropzone', () => {
    let dropzoneInstance, testCaseId, wrapper

    beforeEach(() => {
        testCaseId = 100

        wrapper = mount(
            <Dropzone
                caseId={testCaseId}
                errorMessage=""
                uploadAttachmentSuccess={jest.fn()}
                dropInvalidFileType={jest.fn()}
                dropDuplicateFile={jest.fn()}
                uploadAttachmentFailed={jest.fn()}
                removeDropzoneFile={jest.fn()}
            />
        )

        dropzoneInstance = wrapper.find(DropzoneComponent).instance()
    })

    test('should have correct post-url config when mounted', () => {
        // TODO: pull the hostname from config? or delete this test?
        expect(dropzoneInstance.props.config.postUrl).toEqual(`http://localhost/cases/${testCaseId}/attachments`)
    })

    test('should have maxFiles, addRemoveLinks, and acceptedFile types when mounted', () => {
        // TODO: Is testing the config like this valuable?
        expect(dropzoneInstance.props.djsConfig.maxFiles).toEqual(1)
        expect(dropzoneInstance.props.djsConfig.addRemoveLinks).toEqual(true)
        expect(dropzoneInstance.props.djsConfig.acceptedFiles)
            .toEqual("application/pdf,audio/mpeg,audio/mp3,video/mp4,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg")
    })

    test('should not display invalid file type error by default', () => {
        expect(wrapper.find('[data-test="invalidFileTypeErrorMessage"]').first().text()).toEqual("")
    })

    test('should display invalid file type error when invalid', () => {
        wrapper.setProps({ errorMessage: "File type not supported." })

        containsText(wrapper, '[data-test="invalidFileTypeErrorMessage"]', 'File type not supported.')
    })

    test('should disable upload button by default', () => {
        const submitButton = wrapper.find('[data-test="attachmentUploadButton"]').last()

        expect(submitButton.props()).toHaveProperty("disabled", true)
    })

    test('should disable upload button when attachment absent and description present', () => {
        const inputField = wrapper.find('[data-test="attachmentDescriptionInput"]').last()

        inputField.simulate('change', { target: { value: 'some description' } })

        const submitButton = wrapper.find('[data-test="attachmentUploadButton"]').last()
        expect(submitButton.props()).toHaveProperty("disabled", true)
    })

    test('should disable upload button when description absent and attachment present', () => {
        wrapper.setState({
            attachmentValid: true,
            attachmentDescription: ''
        })

        const submitButton = wrapper.find('[data-test="attachmentUploadButton"]').last()
        expect(submitButton.props()).toHaveProperty("disabled", true)
    })

    test('should enable upload button when description and attachment present', () => {
        wrapper.setState({
            attachmentValid: true,
            attachmentDescription: 'this is a description'
        })

        const submitButton = wrapper.find('[data-test="attachmentUploadButton"]').last()
        expect(submitButton.props()).toHaveProperty("disabled", false)
    })
});