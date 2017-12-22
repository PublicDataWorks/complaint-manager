import nock from 'nock'
import { createCase, createCaseSuccess } from './actionCreators'

describe('createCase', () => {
    test('should call API to create case', async () => {
        const dispatch = jest.fn()
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
            .reply(200, responseBody)

        await createCase(caseDetails)(dispatch)

        expect(dispatch).toHaveBeenCalledWith(
            createCaseSuccess(responseBody)
        )
    })
})