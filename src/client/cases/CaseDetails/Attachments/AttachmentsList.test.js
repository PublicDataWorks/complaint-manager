import React from 'react'
import Attachment from "../../../testUtilities/attachment";
import {mount} from "enzyme";
import AttachmentsList from "./AttachmentsList";

describe('AttachmentsList', () => {
    test('should display attachments in alphabetical order by fileName', () => {
        const attachment1 = new Attachment.Builder()
            .defaultAttachment()
            .withFileName("Z_file.pdf")
            .withId(18)
            .build()

        const attachment2 = new Attachment.Builder()
            .defaultAttachment()
            .withFileName("a_file.pdf")
            .build()

        const attachmentsToDisplay = [attachment1, attachment2]

        const wrapper = mount(<AttachmentsList attachments={attachmentsToDisplay}/>)
        const attachmentList = wrapper.find('[data-test="attachmentRow"]')

        const actualFileNames = attachmentList.map((node) => node.text())
        const expectedFileNames = attachmentsToDisplay.map(attachment => attachment.fileName).reverse()

        expect(actualFileNames).toEqual(expectedFileNames)
    })
});