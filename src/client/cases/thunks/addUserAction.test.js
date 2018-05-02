import getAccessToken from "../../auth/getAccessToken";
import nock from "nock";
import {push} from "react-router-redux";
import addUserAction from "./addUserAction";
import {
    addUserActionFailure, addUserActionSuccess,
    closeUserActionDialog
} from "../../actionCreators/casesActionCreators";

jest.mock("../../auth/getAccessToken", () => jest.fn(() => "TEST_TOKEN"))


describe('addUserAction', () => {

    const dispatch = jest.fn()

    beforeEach(() => {
        dispatch.mockClear()
    })

    test('should redirect immediately if token missing', async () => {
        getAccessToken.mockImplementationOnce(() => false)
        await addUserAction()(dispatch)

        expect(dispatch).toHaveBeenCalledWith(push(`/login`))
    })

    test('should dispatch failure when case creation fails', async () => {
        const userAction = {
            caseId: 12,
            action: 'Miscellaneous',
        }

        nock('http://localhost', {
            reqheaders: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer TEST_TOKEN`
            }
        })
            .post(`/api/cases/${userAction.caseId}/recent-activity`, userAction)
            .reply(500)

        await addUserAction(userAction)(dispatch)

        expect(dispatch).toHaveBeenCalledWith(
            addUserActionFailure()
        )
    })

    test('should dispatch success when user action added successfully', async () => {
        const userAction = {
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
            .post(`/api/cases/${userAction.caseId}/recent-activity`, userAction)
            .reply(201, responseBody)

        await addUserAction(userAction)(dispatch)

        expect(dispatch).toHaveBeenCalledWith(addUserActionSuccess(responseBody))
        expect(dispatch).toHaveBeenCalledWith(closeUserActionDialog())
    })

    test('should not dispatch success if unauthorized and redirect', async () => {
        const userAction = {
            caseId: 12,
            action: 'Miscellaneous',
        }

        nock('http://localhost', {
            reqheaders: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer TEST_TOKEN`
            }
        })
            .post(`/api/cases/${userAction.caseId}/recent-activity`, userAction)
            .reply(401)

        await addUserAction(userAction)(dispatch)

        expect(dispatch).toHaveBeenCalledWith(push(`/login`))
    })
});