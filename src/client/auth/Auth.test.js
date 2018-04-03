import Auth from "./Auth";
import auditLogin from "../users/thunks/auditLogin";
import {mockLocalStorage} from "../../mockLocalStorage";

jest.mock("../users/thunks/auditLogin")
jest.mock('auth0-js', () => ({
    Authentication: jest.fn(() => ({
        userInfo: jest.fn()
    })),
    WebAuth: jest.fn(() => ({
        parseHash: jest.fn((callback) => callback({}, {accessToken: 'AToken', idToken: 'IToken'}))
    }))
}))

describe('Auth', () => {
    test('should call audit login', () => {
        mockLocalStorage();
        const auth = new Auth();

        auth.handleAuthentication();

        expect(auditLogin).toHaveBeenCalledTimes(1)
    });
});