import React from "react";
import {mount} from "enzyme";
import Dropzone from "./Dropzone";
import DropzoneComponent from 'react-dropzone-component'
import { Provider } from "react-redux";
import createConfiguredStore from "../../../createConfiguredStore";
import { fileTypeInvalid } from "../../../actionCreators/attachmentsActionCreators";

jest.mock("../../../auth/getAccessToken", () => jest.fn(() => "TEST_TOKEN"))

describe('Dropzone', () => {
    let dropzoneInstance, testCaseId, store, wrapper

    beforeEach(() => {
        testCaseId = 100

        store = createConfiguredStore()

        wrapper = mount(
            <Provider store={store}>
                <Dropzone caseId={testCaseId}/>
            </Provider>
        )

        dropzoneInstance = wrapper.find(DropzoneComponent).instance()
    })

    test('should have correct post-url config when mounted', () => {
        // TODO: pull the hostname from config? or delete this test?
        expect(dropzoneInstance.props.config.postUrl).toEqual(`http://localhost/cases/${testCaseId}/attachments`)
    })

    test('should have maxFiles, addRemoveLinks, and acceptedFile types when mounted', () => {
        expect(dropzoneInstance.props.djsConfig.maxFiles).toEqual(1)
        expect(dropzoneInstance.props.djsConfig.addRemoveLinks).toEqual(true)
        expect(dropzoneInstance.props.djsConfig.acceptedFiles)
            .toEqual("application/pdf,audio/mp3,video/mp4,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg")
    })

    test('should not display invalid file type error by default', () => {
        expect(wrapper.find('[data-test="invalidFileTypeErrorMessage"]').exists()).toBeFalsy()
    })

    test('should display invalid file type error by when invalid', () => {
        store.dispatch(fileTypeInvalid())
        wrapper.update()

        expect(wrapper.find('[data-test="invalidFileTypeErrorMessage"]').exists()).toBeTruthy()
    })
});