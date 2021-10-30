import removeTagAndAuditDetails from "./removeTagHelper";
import models from "../../policeDataManager/models";
import Tag from "../../testHelpers/tag";
import CaseTag from "../../testHelpers/caseTag";
import Case from "../../../sharedTestHelpers/case";
import { cleanupDatabase } from "../../testHelpers/requestTestHelpers";
import {
  NOT_FOUND_ERRORS
} from "../../../sharedUtilities/errorMessageConstants";

describe("removeTagAndAuditDetails", () => {
  let tag1, tag2, case1;
  beforeEach(async () => {

    const case1Attr = new Case.Builder()
      .defaultCase()
      .withId(612)
      .build();

    const tag1Attr = new Tag.Builder().defaultTag().withName("tag1").withId(37);

    const tag2Attr = new Tag.Builder()
      .defaultTag()
      .withName("tag2")
      .withId(287866);

    tag1 = await models.tag.create(tag1Attr, { auditUser: "Person" });
    tag2 = await models.tag.create(tag2Attr, { auditUser: "Person" });

    case1 = await models.cases.create(case1Attr, { auditUser: "Person" });

    await models.case_tag.create(
      new CaseTag.Builder()
        .defaultCaseTag()
        .withCaseId(case1Attr.id)
        .withTagId(tag1.id),
      { auditUser: "testUser" }
    );
  });

  test("should throw an exception if the tag id doesn't exist", async () => {
    let error;
    try {
      await removeTagAndAuditDetails({ nickname: "User" }, 9999999
      )} catch (e) {
      error = e;
    }

    expect(error.message).toEqual(NOT_FOUND_ERRORS.RESOURCE_NOT_FOUND);
  });

  test("should remove and update tag on success", async () => {
    await removeTagAndAuditDetails({ nickname: "User" }, tag2.id)
    let caseTags = await models.case_tag.findAll({
      where: {
        tagId: tag2.id
      }
    });
    let tag = await models.tag.findOne({
      where: {
        id: tag2.id
      }
    });
    
    expect(caseTags).toHaveLength(0);
    expect(tag).toBeFalsy();
  });

  afterEach(async () => {
    await cleanupDatabase();
  });


});
