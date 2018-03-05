import {mount} from "enzyme";
import React from "react";
import Dropzone from "./Dropzone";
import DropzoneComponent from 'react-dropzone-component'

jest.mock("../../../auth/getAccessToken", () => jest.fn(() => "TEST_TOKEN"))

describe('Dropzone', () => {
    let dropzone, testCaseId
    beforeEach(() => {
        testCaseId = 100
        const wrapper = mount(<Dropzone caseId={testCaseId}/>)
        dropzone = wrapper.find(DropzoneComponent).instance()
    })

    test('should have correct post-url config when mounted', () => {
        expect(dropzone.props.config.postUrl).toEqual(`http://localhost/cases/${testCaseId}/attachments`)
    })

    test('should have maxFiles, addRemoveLinks, and acceptedFile types when mounted', () => {
        expect(dropzone.props.djsConfig.maxFiles).toEqual(1)
        expect(dropzone.props.djsConfig.addRemoveLinks).toEqual(true)
        expect(dropzone.props.djsConfig.acceptedFiles)
            .toEqual("application/pdf,audio/mp3,video/mp4,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg")
    })
});