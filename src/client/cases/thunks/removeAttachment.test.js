import {mockLocalStorage} from "../../../mockLocalStorage";
import nock from "nock";
import removeAttachment from "./removeAttachment";
import {removeAttachmentFailed, removeAttachmentSuccess} from "../../actionCreators/attachmentsActionCreators";

jest.mock("../../auth/getAccessToken", () => jest.fn(() => "TEST_TOKEN"))

describe('remove attachment', () => {
    let mockCaseNumber, mockFileName, dispatch, caseDetails
    beforeEach(() => {
        mockCaseNumber = 109
        mockFileName = 'sample.text'
        caseDetails = {fileName:'sample.text'}
        dispatch = jest.fn()
        mockLocalStorage()
    });

    test('should dispatch error action if we get a 500 response', async () => {
        nock('http://localhost', {})
            .delete(`/cases/${mockCaseNumber}/attachments/${mockFileName}`)
            .reply(500, caseDetails)

        await removeAttachment(mockCaseNumber, mockFileName, jest.fn())(dispatch)
        expect(dispatch).toHaveBeenCalledWith(removeAttachmentFailed())
    })

    test('should dispatch error action if we get an unrecognized response', async () => {
        nock('http://localhost', {})
            .delete(`/cases/${mockCaseNumber}/attachments/${mockFileName}`)
            .reply(503, caseDetails)

        await removeAttachment(mockCaseNumber, mockFileName, jest.fn())(dispatch)
        expect(dispatch).toHaveBeenCalledWith(removeAttachmentFailed())
    })

    test('should dispatch success when attachment removal was successful', async () => {
        nock('http://localhost', {
            'Content-Type': 'application/json',
            'Authorization': `Bearer TEST_TOKEN`
        })
            .delete(`/cases/${mockCaseNumber}/attachments/${mockFileName}`)
            .reply(200, caseDetails)

        await removeAttachment(mockCaseNumber, mockFileName, jest.fn())(dispatch)
        expect(dispatch).toHaveBeenCalledWith(removeAttachmentSuccess(caseDetails))
    })

    test('should dispatch close dialog when attachment was successful', async () => {
        nock('http://localhost', {
            'Content-Type': 'application/json',
            'Authorization': `Bearer TEST_TOKEN`
        })
            .delete(`/cases/${mockCaseNumber}/attachments/${mockFileName}`)
            .reply(200, caseDetails)

        const callback = jest.fn()
        await removeAttachment(mockCaseNumber, mockFileName, callback)(dispatch)
        expect(callback).toHaveBeenCalled()

    })
});