import nock from "nock";
import getAccessToken from "../../auth/getAccessToken";
import getCaseDetail from "./getCaseDetails";
import { getCaseDetailsSuccess } from "../../actionCreators/casesActionCreators";
import {push} from 'react-router-redux'


jest.mock("../../auth/getAccessToken", () => jest.fn(() => "TEST_TOKEN"))

describe('getCase', () => {
    const dispatch = jest.fn()
    const responseBody = { caseDetailProp: 'case detail value' }
    const caseId = 100

    beforeEach(() => {
        getAccessToken.mockClear()
        dispatch.mockClear()
    })

    test('should dispatch success when case retrieved', async () => {
        nock('http://localhost', {
            reqheaders: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer TEST_TOKEN`
            }
        })
            .get(`/cases/${caseId}`)
            .reply(200, responseBody)

        await getCaseDetail(caseId)(dispatch)

        expect(dispatch).toHaveBeenCalledWith(getCaseDetailsSuccess(responseBody))
    })

    test('should not dispatch success and should redirect when 401 returned', async () => {
        nock('http://localhost', {
            reqheaders: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer TEST_TOKEN`
            }
        })
            .get(`/cases/${caseId}`)
            .reply(401, responseBody)

        await getCaseDetail(caseId)(dispatch)

        expect(dispatch).not.toHaveBeenCalledWith(getCaseDetailsSuccess(responseBody))
        expect(dispatch).toHaveBeenCalledWith(push(`/login`))
    })

    test('should redirect immediately if token missing', async () => {
        getAccessToken.mockImplementation(() => false)

        nock('http://localhost', {
            reqheaders: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer false`
            }
        })
            .get(`/cases/${caseId}`)
            .reply(200, responseBody)

        await getCaseDetail(caseId)(dispatch)

        expect(dispatch).not.toHaveBeenCalledWith(getCaseDetailsSuccess(responseBody))
        expect(dispatch).toHaveBeenCalledWith(push(`/login`))
    })
})