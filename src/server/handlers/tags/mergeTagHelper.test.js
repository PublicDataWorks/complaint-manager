import mergeTagAndAuditDetails from "./mergeTagHelper";
import models from "../../policeDataManager/models";
import Tag from "../../testHelpers/tag";
import CaseTag from "../../testHelpers/caseTag";
import Case from "../../../sharedTestHelpers/case";
import CaseStatus from "../../../sharedTestHelpers/caseStatus";
import { cleanupDatabase } from "../../testHelpers/requestTestHelpers";
import {
  NOT_FOUND_ERRORS,
  BAD_REQUEST_ERRORS
} from "../../../sharedUtilities/errorMessageConstants";

describe("mergeTagAndAuditDetails", () => {
  let tag1, tag2, case1, case2;

  jest.setTimeout(60000);
  beforeEach(async () => {
    await cleanupDatabase();
    await models.caseStatus.create(
      new CaseStatus.Builder().defaultCaseStatus().build(),
      { auditUser: "user" }
    );

    const case1Attr = new Case.Builder().defaultCase().withId(612).build();
    const case2Attr = new Case.Builder().defaultCase().withId(613).build();

    const tag1Attr = new Tag.Builder().defaultTag().withName("tag1").withId(37);
    const tag2Attr = new Tag.Builder()
      .defaultTag()
      .withName("tag2")
      .withId(287866);

    tag1 = await models.tag.create(tag1Attr, { auditUser: "Person" });
    tag2 = await models.tag.create(tag2Attr, { auditUser: "Person" });

    case1 = await models.cases.create(case1Attr, { auditUser: "Person" });
    case2 = await models.cases.create(case2Attr, { auditUser: "Person" });

    await models.case_tag.create(
      new CaseTag.Builder()
        .defaultCaseTag()
        .withCaseId(case1Attr.id)
        .withTagId(tag1.id),
      { auditUser: "testUser" }
    );

    await models.case_tag.create(
      new CaseTag.Builder()
        .defaultCaseTag()
        .withCaseId(case1Attr.id)
        .withTagId(tag2.id),
      { auditUser: "testUser" }
    );

    await models.case_tag.create(
      new CaseTag.Builder()
        .defaultCaseTag()
        .withCaseId(case2Attr.id)
        .withTagId(tag1.id),
      { auditUser: "testUser" }
    );
  });

  test("should throw an error when delete tag doesn't exist", async () => {
    let error;
    try {
      await mergeTagAndAuditDetails({ nickname: "User" }, 9999999, tag2.id);
    } catch (e) {
      error = e;
    }
    expect(error).not.toBeUndefined();
    expect(error.message).toEqual(NOT_FOUND_ERRORS.RESOURCE_NOT_FOUND);
  });

  test("should throw an error when merge tag doesn't exist", async () => {
    let error;
    try {
      await mergeTagAndAuditDetails({ nickname: "User" }, tag1.id, 9999999);
    } catch (e) {
      error = e;
    }
    expect(error).not.toBeUndefined();
    expect(error.message).toEqual(BAD_REQUEST_ERRORS.MERGE_TAG_DOES_NOT_EXIST);
  });

  describe("Success Cases", () => {
    beforeEach(async () => {
      await mergeTagAndAuditDetails({ nickname: "User" }, tag1.id, tag2.id);
    });

    test("should delete case tags tables rows for deleted tag if merge tag is already associated with case", async () => {
      let caseTags = await models.case_tag.findAll({
        where: { caseId: case1.id }
      });

      expect(caseTags).toHaveLength(1);
      expect(caseTags[0].tagId).toEqual(tag2.id);
    });

    test("should update all remaining case tag entries to replace that tag id with the new merge tag id", async () => {
      let caseTags = await models.case_tag.findAll({
        where: { caseId: case2.id }
      });

      expect(caseTags).toHaveLength(1);
      expect(caseTags[0].tagId).toEqual(tag2.id);
    });

    test("should delete row of deleted tag in tag table", async () => {
      let remainingTag = await models.tag.findAll({ where: { id: tag1.id } });

      expect(remainingTag).toHaveLength(0);
    });
  });

  //test("should rollback to previous state if unable to execute merge successfully")

  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });
});
