import httpMocks from "node-mocks-http";
import {
  AUDIT_SUBJECT,
  MANAGER_TYPE
} from "../../../sharedUtilities/constants";
import auditDataAccess from "../audits/auditDataAccess";
import getUsers from "./getUsers";
import { getUsers as auth0GetUsers } from "../../services/auth0UserService";
import { suppressWinstonLogs } from "../../testHelpers/requestTestHelpers";
import { authEnabledTest } from "../../testHelpers/authEnabledTest";

jest.mock("../audits/auditDataAccess");

jest.mock("../../services/auth0UserService");

describe("getUsers tests", () => {
  let mockGetUserRequest, mockGetUserResponse, next, auth0Users;

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

    auth0Users = {
      name: "john doe",
      email: "john.doe@thoughtworks.com"
    };
  });

  afterEach(() => {
    auth0GetUsers.mockClear();
  });

  describe("Successful path", () => {
    const test = authEnabledTest();
    test("Should call getUsers", async () => {
      auth0GetUsers.mockImplementationOnce(() => {
        return auth0Users;
      });

      await getUsers(mockGetUserRequest, mockGetUserResponse, next);

      expect(auth0GetUsers).toBeCalledTimes(1);
      expect(mockGetUserResponse.statusCode).toEqual(200);
      expect(mockGetUserResponse._getData()).toEqual(auth0Users);
    });
  });

  describe("Error Handling", () => {
    const test = authEnabledTest();
    test(
      "Should throw error if getUsers fails",
      suppressWinstonLogs(async () => {
        auth0GetUsers.mockImplementationOnce(() => {
          throw new Error("I am failing!");
        });

        await getUsers(mockGetUserRequest, mockGetUserResponse, next);
        expect(next).toHaveBeenCalledWith(new Error("I am failing!"));
      })
    );
  });

  describe("Auditing", () => {
    beforeAll(() => {
      auth0GetUsers.mockImplementation(() => auth0Users);
    });

    test(
      "Should audit when accessing user data",
      suppressWinstonLogs(async () => {
        await getUsers(mockGetUserRequest, mockGetUserResponse, next);

        expect(auditDataAccess).toHaveBeenCalledWith(
          mockGetUserRequest.nickname,
          null,
          MANAGER_TYPE.COMPLAINT,
          AUDIT_SUBJECT.ALL_USER_DATA,
          { users: { attributes: ["name", "email"] } },
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
