import nock from 'nock'
import createUser from "./createUser"
import {createUserFailure, createUserSuccess} from "../actionCreators"

describe('createUser', () => {
    let dispatch

    beforeEach(() => {
        dispatch = jest.fn()
    })

    test('should dispatch success when user created successfully', async () => {
        const user = {
            someUser: 'some value'
        }
        const responseBody = {
            someResponse: 'the response'
        }

        nock('http://localhost', {
            reqheaders: {
                'Content-Type': 'application/json'
            }
        })
            .post('/users', user)
            .reply(201, responseBody)

        await createUser(user)(dispatch)

        expect(dispatch).toHaveBeenCalledWith(
            createUserSuccess(responseBody)
        )
    })

    test('should dispatch failure when user not created successfully', async () => {
        const user = {
            someUser: 'some value'
        }

        nock('http://localhost', {
            reqheaders: {
                'Content-Type': 'application/json'
            }
        })
            .post('/users', user)
            .reply(500)

        await createUser(user)(dispatch)

        expect(dispatch).toHaveBeenCalledWith(
            createUserFailure()
        )
    })
})