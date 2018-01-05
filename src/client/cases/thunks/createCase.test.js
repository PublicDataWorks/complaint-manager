import nock from 'nock'
import {createCaseSuccess, createCaseFailure, requestCaseCreation} from '../actionCreators'
import createCase from "./createCase";

describe('createCase', () => {
    let dispatch

    beforeEach(() => {
        dispatch = jest.fn()
    })

    test('should dispatch case creation requested action', () =>{
        createCase()(dispatch)

        expect(dispatch).toHaveBeenCalledWith(
            requestCaseCreation()
        )
    })

    test('should call API to create case', async () => {
        const caseDetails = {
            firstName: 'Fats',
            lastName: 'Domino'
        }
        const responseBody = {
            firstName: 'Fats',
            lastName: 'Domino',
            status: 'Initial'
        }

        nock('http://localhost', {
            reqheaders: {
                'Content-Type': 'application/json'
            }
        })
            .post('/cases', caseDetails)
            .reply(201, responseBody)

        await createCase(caseDetails)(dispatch)

        expect(dispatch).toHaveBeenCalledWith(
            createCaseSuccess(responseBody)
        )
    })

    test('should handle case creation failure', async () => {
        const caseDetails = {
            firstName: 'Fats',
            lastName: 'Domino'
        }

        nock('http://localhost', {
            reqheaders: {
                'Content-Type': 'application/json'
            }
        })
            .post('/cases', caseDetails)
            .reply(500)

        await createCase(caseDetails)(dispatch)

        expect(dispatch).toHaveBeenCalledWith(
            createCaseFailure()
        )

    })
})