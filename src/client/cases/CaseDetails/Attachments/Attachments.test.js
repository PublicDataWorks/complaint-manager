import React from 'react'
import Attachments from './Attachments'
import { mount } from 'enzyme'
import Dropzone from "./Dropzone";
import Case from "../../../testUtilities/case";

jest.mock("../../../auth/getAccessToken", () => jest.fn(() => "TEST_TOKEN"))

describe('Attachments card', () => {
    test('should have a dropzone', () => {
        const caseDetail = new Case.Builder().defaultCase().build()
        const attachmentsCard = mount(<Attachments caseDetail={caseDetail}/>)
        expect(attachmentsCard.find(Dropzone).exists()).toBeTruthy()
    })
});