import request from "supertest";
import app from "../../../server";

import {
  buildTokenWithPermissions,
  cleanupDatabase
} from "../../../testHelpers/requestTestHelpers";
import { createTestCaseWithoutCivilian } from "../../../testHelpers/modelMothers";
import { BAD_REQUEST_ERRORS } from "../../../../sharedUtilities/errorMessageConstants";

const httpMocks = require("node-mocks-http");
const AWS = require("aws-sdk");

jest.mock("aws-sdk", () => ({
  S3: jest.fn()
}));

describe("upload attachment", function() {
  let token;
  beforeEach(() => {
    token = buildTokenWithPermissions("", "tuser");
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  test("should return archived error when case is archived", async () => {
    AWS.S3.mockImplementation(() => {
      return {
        upload: (params, options) => ({
          promise: () => Promise.resolve({ Key: mockKey })
        }),
        config: {
          loadFromPath: jest.fn(),
          update: jest.fn()
        }
      };
    });

    const existingCase = await createTestCaseWithoutCivilian();
    await existingCase.destroy({ auditUser: "tuser" });

    await request(app)
      .post(`/api/cases/${existingCase.id}/attachments`)
      .set("Authorization", `Bearer ${token}`)
      .expect(400)
      .then(response => {
        expect(response.body.message).toEqual(
          BAD_REQUEST_ERRORS.CANNOT_UPDATE_ARCHIVED_CASE
        );
      });
  });
});
