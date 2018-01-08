import getUsers from "./getUsers";
import nock from "nock";
import {getUsersSuccess} from "../actionCreators";

describe('getUsers thunk', () => {

    test('should call the API to get users', async () => {
        const dispatch = jest.fn()
        const responseBody = {users: ['some user']};

        nock('http://localhost', {
            reqheaders: {
                'Content-Type': 'application/json'
            }
        })
            .get('/users')
            .reply(200, responseBody)

        await getUsers()(dispatch)

        expect(dispatch).toHaveBeenCalledWith(getUsersSuccess(responseBody.users))
    })
})