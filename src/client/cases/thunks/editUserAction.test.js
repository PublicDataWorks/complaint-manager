import getAccessToken from "../../auth/getAccessToken";
import nock from "nock";
import {push} from "react-router-redux";
import editUserAction from "./editUserAction";
import {
    editUserActionFailure, editUserActionSuccess,
    closeUserActionDialog
} from "../../actionCreators/casesActionCreators";

jest.mock("../../auth/getAccessToken", () => jest.fn(() => "TEST_TOKEN"))


describe('editUserAction', () => {

    const dispatch = jest.fn()

    beforeEach(() => {
        dispatch.mockClear()
    })

    test('should redirect immediately if token missing', async () => {
        getAccessToken.mockImplementationOnce(() => false)
        await editUserAction()(dispatch)

        expect(dispatch).toHaveBeenCalledWith(push(`/login`))
    })

    test('should dispatch failure when edit user action fails', async () => {
        const userAction = {
            id: 1,
            caseId: 12,
            action: 'Miscellaneous',
        }

        nock('http://localhost', {
            reqheaders: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer TEST_TOKEN`
            }
        })
            .put(`/api/cases/${userAction.caseId}/recent-activity/${userAction.id}`, userAction)
            .reply(500)

        await editUserAction(userAction)(dispatch)

        expect(dispatch).toHaveBeenCalledWith(
            editUserActionFailure()
        )
    })

    test('should dispatch success when user action edited successfully', async () => {
        const userAction = {
            id: 1,
            caseId: 12,
            action: 'Miscellaneous',
        }

        const responseBody = [{action: 'Miscellaneous'}]

        nock('http://localhost', {
            reqheaders: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer TEST_TOKEN`
            }
        })
            .put(`/api/cases/${userAction.caseId}/recent-activity/${userAction.id}`, userAction)
            .reply(200, responseBody)

        await editUserAction(userAction)(dispatch)

        expect(dispatch).toHaveBeenCalledWith(editUserActionSuccess(responseBody))
        expect(dispatch).toHaveBeenCalledWith(closeUserActionDialog())
    })

    test('should not dispatch success if unauthorized and redirect', async () => {
        const userAction = {
            id:1,
            caseId: 12,
            action: 'Miscellaneous',
        }

        nock('http://localhost', {
            reqheaders: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer TEST_TOKEN`
            }
        })
            .put(`/api/cases/${userAction.caseId}/recent-activity/${userAction.id}`, userAction)
            .reply(401)

        await editUserAction(userAction)(dispatch)

        expect(dispatch).toHaveBeenCalledWith(push(`/login`))
    })
});