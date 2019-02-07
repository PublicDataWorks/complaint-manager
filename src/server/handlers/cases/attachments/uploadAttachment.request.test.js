import request from "supertest";
import app from "../../../server";

import {
  buildTokenWithPermissions,
  cleanupDatabase
} from "../../../testHelpers/requestTestHelpers";
import { createTestCaseWithoutCivilian } from "../../../testHelpers/modelMothers";
import Attachment from "../../../../client/testUtilities/attachment";
import models from "../../../models/index";
import deleteAttachment from "./deleteAttachment";
const httpMocks = require("node-mocks-http");
import {
  AUDIT_ACTION,
  AUDIT_TYPE,
  AUDIT_SUBJECT
} from "../../../../sharedUtilities/constants";
import { BAD_REQUEST_ERRORS } from "../../../../sharedUtilities/errorMessageConstants";
const AWS = require("aws-sdk");

jest.mock("aws-sdk");

describe("upload attachment", function() {
  let token;
  beforeEach(() => {
    token = buildTokenWithPermissions("", "tuser");
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  test("should return archived error when case is archived", async () => {
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
