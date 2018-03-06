import React from 'react'
import Attachments from './Attachments'
import { mount } from 'enzyme'
import Dropzone from "./Dropzone";
import Case from "../../../testUtilities/case";
import { containsText } from "../../../../testHelpers";

jest.mock("../../../auth/getAccessToken", () => jest.fn(() => "TEST_TOKEN"))

describe('Attachments card', () => {
    test('should have a dropzone', () => {
        const caseDetail = new Case.Builder().defaultCase().build()
        const attachmentsCard = mount(<Attachments caseDetail={caseDetail}/>)
        expect(attachmentsCard.find(Dropzone).exists()).toBeTruthy()
    })

    test('should display attachments if they exist', () => {
        const caseDetail = new Case.Builder().defaultCase().build()
        const attachmentFileName = caseDetail.attachments[0].key

        const attachmentsCard = mount(<Attachments caseDetail={caseDetail}/>)

        containsText(attachmentsCard, 'div[data-test="attachmentsField"]', attachmentFileName)
    })

    test('should display no attachments is null', () => {
        const caseDetail = new Case.Builder().defaultCase().withAttachments(null).build()

        const attachmentsCard = mount(<Attachments caseDetail={caseDetail}/>)

        containsText(attachmentsCard, 'div[data-test="attachmentsField"]', 'No Attachments')
    })

    test('should display no attachments if attachments is empty list', () => {
        const caseDetail = new Case.Builder().defaultCase().withAttachments([]).build()

        const attachmentsCard = mount(<Attachments caseDetail={caseDetail}/>)

        containsText(attachmentsCard, 'div[data-test="attachmentsField"]', 'No Attachments')
    })
});