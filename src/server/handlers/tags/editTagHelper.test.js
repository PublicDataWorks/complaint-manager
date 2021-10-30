import editTagAndAuditDetails from "./editTagHelper";
import models from "../../policeDataManager/models";
import Tag from "../../testHelpers/tag";
import { cleanupDatabase } from "../../testHelpers/requestTestHelpers";
import {
  BAD_REQUEST_ERRORS,
  NOT_FOUND_ERRORS
} from "../../../sharedUtilities/errorMessageConstants";

describe("editTagAndAuditDetails", () => {
  let tag1, tag2;
  beforeEach(async () => {
    const tag1Attr = new Tag.Builder().defaultTag().withName("tag1").withId(37);

    const tag2Attr = new Tag.Builder()
      .defaultTag()
      .withName("tag2")
      .withId(287866);

    tag1 = await models.tag.create(tag1Attr, { auditUser: "Person" });
    tag2 = await models.tag.create(tag2Attr, { auditUser: "Person" });
  });

  test("should throw an exception if the new tag name already exists", async () => {
    let error;
    try {
      await editTagAndAuditDetails({ nickname: "User" }, tag2.id, {
        name: tag1.name,
        id: tag2.id
      });
    } catch (e) {
      error = e;
    }

    expect(error.message).toEqual(BAD_REQUEST_ERRORS.TAG_WITH_NAME_EXISTS);
  });

  test("should throw an exception if the tag id doesn't exist", async () => {
    let error;
    try {
      await editTagAndAuditDetails({ nickname: "User" }, 9999999, {
        name: "totally unique name",
        id: 9999999
      });
    } catch (e) {
      error = e;
    }

    expect(error.message).toEqual(NOT_FOUND_ERRORS.RESOURCE_NOT_FOUND);
  });

  test("should update and return updated tag on success", async () => {
    let result = await editTagAndAuditDetails({ nickname: "User" }, tag2.id, {
      name: "totally unique name",
      id: tag2.id
    });
    expect(result).toEqual({
      id: tag2.id,
      name: "totally unique name"
    });
  });

  afterEach(async () => {
    await cleanupDatabase();
  });
});
