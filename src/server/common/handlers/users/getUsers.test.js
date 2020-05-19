import httpMocks from "node-mocks-http";
import getUsers from "./getUsers";
import {
    AUDIT_SUBJECT,
    MANAGER_TYPE
} from "../../../../sharedUtilities/constants";
import auditDataAccess from "../../../handlers/audits/auditDataAccess";
import {getUsers} from "../../../services/auth0UserServices";

import Boom from "boom";
import {suppressWinstonLogs} from "../../../testHelpers/requestTestHelpers";

jest.mock("../../../handlers/audits/auditDataAccess");
jest.mock("../../../services/auth0UserServices");
let auth0Users = {
    "name": "john doe",
    "email": "john.doe@thoughtworks.com",
};


describe("getUsers tests", () => {
    let mockGetUserRequest, mockGetUserResponse, next;

    beforeEach(() => {
        mockGetUserRequest = httpMocks.createRequest({
            method: "GET",
            headers: {
                authorization: "Bearer token"
            },
            nickname: "nickname"
        });
        mockGetUserResponse = httpMocks.createResponse();

        next = jest.fn();
        process.env.NODE_ENV = "development";
        getUsers.mockClear();
    });

    describe("Successful path", () => {

        test("Should Call getUsersFromAuth0", async () => {
            getUsers.mockImplementation(() => auth0Users)

            await getUsers(mockGetUserRequest, mockGetUserResponse, next);

            expect(getUsers).toBeCalledTimes(1);
            expect(mockGetUserResponse.statusCode).toEqual(200);
            expect(mockGetUserResponse._getData()).toEqual(auth0Users)
        })
    });

    describe("Error Handling", () => {
        test(
            "Should throw error if getUsersFromAuth0 fails",
            suppressWinstonLogs(async () => {

                getUsers.mockImplementationOnce(() => {
                    throw new Error("I am failing!")
                });

                await getUsers(mockGetUserRequest, mockGetUserResponse, next);
                expect(next).toHaveBeenCalledWith(new Error("I am failing!"));
            })
        );
    });

    describe("Auditing", () => {
        beforeAll(() => {
            getUsers.mockImplementation(() => auth0Users)
        })

        test(
            "Should audit when accessing user data",
            suppressWinstonLogs(async () => {
                await getUsers(mockGetUserRequest, mockGetUserResponse, next);

                expect(auditDataAccess).toHaveBeenCalledWith(
                    mockGetUserRequest.nickname,
                    null,
                    MANAGER_TYPE.COMPLAINT,
                    AUDIT_SUBJECT.ALL_USER_DATA,
                    {users: {attributes: ["name", "email"]}},
                    expect.anything()
                );
            })
        );

        test(
            "Should throw error if audit fails",
            suppressWinstonLogs(async () => {
                auditDataAccess.mockImplementation(() => {
                    throw new Error("I am failing!");
                });

                await getUsers(mockGetUserRequest, mockGetUserResponse, next);
                expect(next).toHaveBeenCalledWith(new Error("I am failing!"));
            })
        );
    });
});
