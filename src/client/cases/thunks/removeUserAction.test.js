import removeUserAction from "./removeUserAction";
import nock from "nock";
import {push} from "react-router-redux";
import getAccessToken from "../../auth/getAccessToken";
import {
    closeRemoveUserActionDialog,
    removeUserActionFailure,
    removeUserActionSuccess
} from "../../actionCreators/casesActionCreators";

jest.mock("../../auth/getAccessToken", () => jest.fn(() => "TEST_TOKEN"))

describe('removeUserAction', ()=>{
    test('should dispatch success when user action removed successfully', async () => {
        const dispatch = jest.fn()

        const caseId = 1
        const userActionId = 2

        const responseBody = {
            caseDetails:{
                some: 'case'
            }
        }

        nock('http://localhost', {
            reqheaders: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer TEST_TOKEN'
            }
        })
            .delete(`/api/cases/${caseId}/recent-activity/${userActionId}`)
            .reply(200, responseBody)

        await removeUserAction(caseId, userActionId)(dispatch)


        expect(dispatch).toHaveBeenCalledWith(
            removeUserActionSuccess(responseBody)
        )
        expect(dispatch).toHaveBeenCalledWith(
            closeRemoveUserActionDialog()
        )
    })

    test('should dispatch failure when remove user action fails', async () => {
        const dispatch = jest.fn()

        const caseId = 1
        const userActionId = 2

        nock('http://localhost', {
            reqheaders: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer TEST_TOKEN'
            }
        })
            .delete(`/api/cases/${caseId}/recent-activity/${userActionId}`)
            .reply(500)

        await removeUserAction(caseId, userActionId)(dispatch)

        expect(dispatch).toHaveBeenCalledWith(removeUserActionFailure())
    })

    test('should redirect if unauthorized', async () => {
        const dispatch = jest.fn()

        const caseId = 1
        const userActionId = 2

        nock('http://localhost', {
            reqheaders: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer TEST_TOKEN'
            }
        })
            .delete(`/api/cases/${caseId}/recent-activity/${userActionId}`)
            .reply(401)

        await removeUserAction(caseId, userActionId)(dispatch)

        expect(dispatch).toHaveBeenCalledWith(push('/login'))
    })

    test('should redirect immediately if token missing', async () => {
        const dispatch = jest.fn()

        const caseId = 1
        const userActionId = 2

        getAccessToken.mockImplementationOnce(() => false)

        nock('http://localhost', {
            reqheaders: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer false'
            }
        })
            .delete(`/api/cases/${caseId}/recent-activity/${userActionId}`)
            .reply(200)

        await removeUserAction(caseId, userActionId)(dispatch)

        expect(dispatch).toHaveBeenCalledWith(push(`/login`))
    })
})