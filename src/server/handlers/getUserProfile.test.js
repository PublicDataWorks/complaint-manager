import * as httpMocks from "node-mocks-http";
import getUserProfile from "./getUserProfile"
import { AuthenticationClient } from "auth0";

jest.mock('auth0', () => ({
    AuthenticationClient: jest.fn()
}))

describe('getUserProfile', () => {
    test('should throw error if authorization header is invalid', async () => {
        const request = httpMocks.createRequest({
            headers: {
                authorization: 'INVALID_TOKEN_FORMAT'
            }
        })
        const response = httpMocks.createResponse()
        const next = jest.fn()

        await getUserProfile(request, response, next)

        expect(next).toHaveBeenCalledWith(new Error('Malformed authorization header'))
    })

    test('should attach nickname to request when token is valid', async () => {
        const request = httpMocks.createRequest({
            headers: {
                authorization: 'Bearer VALID_TOKEN_FORMAT'
            }
        })
        const response = httpMocks.createResponse()

        const userNickname = 'test_user'
        AuthenticationClient.mockImplementation(() => {
            return {
                users: {
                    getInfo: () => Promise.resolve({nickname: userNickname})
                }
            }
        })

        await getUserProfile(request, response, jest.fn())
        expect(request.nickname).toEqual(userNickname)
    })
})
