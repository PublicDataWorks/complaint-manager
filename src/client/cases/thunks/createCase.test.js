import nock from 'nock'
import {createCaseFailure, createCaseSuccess, getCasesSuccess, requestCaseCreation} from '../../actionCreators/casesActionCreators'
import createCase from "./createCase";
import {push} from "react-router-redux";
import getAccessToken from "../../auth/getAccessToken";

jest.mock("../../auth/getAccessToken", () => jest.fn(() => "TEST_TOKEN"))

describe('createCase', () => {
    const dispatch = jest.fn()

    beforeEach(() => {
        dispatch.mockClear()
    })

    //TODO Can we remove it?
    test('should dispatch case creation requested action', () => {
        createCase()(dispatch)

        expect(dispatch).toHaveBeenCalledWith(
            requestCaseCreation()
        )
    })

    test('should dispatch success when case created successfully', async () => {
        const creationDetails = {
            caseDetails: {
                firstName: 'Fats',
                lastName: 'Domino'
            },
            redirect: false
        }

        const responseBody = {
            firstName: 'Fats',
            lastName: 'Domino',
            status: 'Initial'
        }

        nock('http://localhost', {
            reqheaders: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer TEST_TOKEN`
            }
        })
            .post('/api/cases', creationDetails.caseDetails)
            .reply(201, responseBody)

        await createCase(creationDetails)(dispatch)

        expect(dispatch).toHaveBeenCalledWith(
            createCaseSuccess(responseBody)
        )
    })

    test('should dispatch failure when case creation fails', async () => {
        const caseDetails = {
            firstName: 'Fats',
            lastName: 'Domino'
        }

        nock('http://localhost', {
            reqheaders: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer TEST_TOKEN`
            }
        })
            .post('/api/cases', caseDetails)
            .reply(500)

        await createCase(caseDetails)(dispatch)

        expect(dispatch).toHaveBeenCalledWith(
            createCaseFailure()
        )
    })

    test('should not dispatch success if unauthorized and redirect', async () => {
        const creationDetails = {}

        nock('http://localhost', {
            reqheaders: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer TEST_TOKEN`
            }
        })
            .post('/api/cases', creationDetails.caseDetails)
            .reply(401)

        await createCase(creationDetails)(dispatch)

        expect(dispatch).toHaveBeenCalledWith(push(`/login`))
    })

    test('should redirect immediately if token missing', async () => {
        const responseBody = {cases: []}
        getAccessToken.mockImplementation(() => false)
        await createCase()(dispatch)

        expect(dispatch).not.toHaveBeenCalledWith(createCaseSuccess(responseBody.cases))
        expect(dispatch).toHaveBeenCalledWith(createCaseFailure())
        expect(dispatch).toHaveBeenCalledWith(push(`/login`))
    })
})