import { cleanupDatabase } from "../../testHelpers/requestTestHelpers";
import getQueryAuditAccessDetails from "../audits/getQueryAuditAccessDetails";
import models from "../../policeDataManager/models";
import {
  getTagsAndAuditDetails,
  getTagsWithCountAndAuditDetails
} from "./getTagsHelper";
import { ASCENDING } from "../../../sharedUtilities/constants";
import { caseInsensitiveSort } from "../sequelizeHelpers";
import Case from "../../../sharedTestHelpers/case";
import CaseTag from "../../testHelpers/caseTag";
import Tag from "../../testHelpers/tag";

jest.mock("../audits/getQueryAuditAccessDetails", () =>
  jest.fn(() => {
    return {
      mockAssociation: {
        attributes: ["mockDetails"],
        model: "mockModelName"
      }
    };
  })
);

describe("getTagsHelper", () => {
  let firstTag, secondTag, thirdTag, fourthTag;
  beforeEach(async () => {
    const firstTagAttributes = new Tag.Builder()
      .defaultTag()
      .withName("alabama")
      .withId(1);
    const secondTagAttributes = new Tag.Builder()
      .defaultTag()
      .withName("Aloha")
      .withId(2);
    const thirdTagAttributes = new Tag.Builder()
      .defaultTag()
      .withName("Zed")
      .withId(3);
    const fourthTagAttributes = new Tag.Builder()
      .defaultTag()
      .withName("zoo")
      .withId(4);

    secondTag = await models.tag.create(secondTagAttributes, {
      auditUser: "Person"
    });
    firstTag = await models.tag.create(firstTagAttributes, {
      auditUser: "Person"
    });
    fourthTag = await models.tag.create(fourthTagAttributes, {
      auditUser: "Person"
    });
    thirdTag = await models.tag.create(thirdTagAttributes, {
      auditUser: "Person"
    });
  });
  afterEach(async () => {
    await cleanupDatabase();
  });

  describe("getTagsAndAuditDetails", () => {
    test("should get all tags ordered alphabetically", async () => {
      const tagsAndAuditDetails = await getTagsAndAuditDetails();
      const expectedTags = [
        { name: firstTag.name, id: firstTag.id },
        { name: secondTag.name, id: secondTag.id },
        { name: thirdTag.name, id: thirdTag.id },
        { name: fourthTag.name, id: fourthTag.id }
      ];

      expect(tagsAndAuditDetails).toEqual({
        tags: expectedTags,
        auditDetails: expect.anything()
      });
    });

    test("should call getQueryAuditAccessDetails when getting tags", async () => {
      await getTagsAndAuditDetails();

      expect(getQueryAuditAccessDetails).toHaveBeenCalledWith(
        expect.objectContaining({
          order: [[caseInsensitiveSort("name", models.tag), ASCENDING]]
        }),
        models.tag.name
      );
    });
  });

  describe("getTagsWithCountAndAuditDetails", () => {
    beforeEach(async () => {
      let case1 = await models.cases.create(
        new Case.Builder().defaultCase().withId(1),
        {
          auditUser: "Person"
        }
      );

      let case2 = await models.cases.create(
        new Case.Builder().defaultCase().withId(2),
        {
          auditUser: "Person"
        }
      );

      let case3 = await models.cases.create(
        new Case.Builder().defaultCase().withId(3),
        {
          auditUser: "Person"
        }
      );

      let caseTag1 = await models.case_tag.create(
        new CaseTag.Builder()
          .defaultCaseTag()
          .withCaseId(1)
          .withTagId(firstTag.id),
        {
          auditUser: "Person"
        }
      );

      let caseTag2 = await models.case_tag.create(
        new CaseTag.Builder()
          .defaultCaseTag()
          .withCaseId(2)
          .withTagId(firstTag.id),
        {
          auditUser: "Person"
        }
      );

      let caseTag3 = await models.case_tag.create(
        new CaseTag.Builder()
          .defaultCaseTag()
          .withCaseId(1)
          .withTagId(secondTag.id),
        {
          auditUser: "Person"
        }
      );

      let caseTag7 = await models.case_tag.create(
        new CaseTag.Builder()
          .defaultCaseTag()
          .withCaseId(2)
          .withTagId(secondTag.id),
        {
          auditUser: "Person"
        }
      );

      let caseTag4 = await models.case_tag.create(
        new CaseTag.Builder()
          .defaultCaseTag()
          .withCaseId(1)
          .withTagId(fourthTag.id),
        {
          auditUser: "Person"
        }
      );

      let caseTag5 = await models.case_tag.create(
        new CaseTag.Builder()
          .defaultCaseTag()
          .withCaseId(2)
          .withTagId(fourthTag.id),
        {
          auditUser: "Person"
        }
      );

      let caseTag6 = await models.case_tag.create(
        new CaseTag.Builder()
          .defaultCaseTag()
          .withCaseId(3)
          .withTagId(fourthTag.id),
        {
          auditUser: "Person"
        }
      );
    });

    test("should get all tags with count ordered by count", async () => {
      const tagsAndAuditDetails = await getTagsWithCountAndAuditDetails();
      const expectedTags = [
        { name: fourthTag.name, id: fourthTag.id, count: "3" },
        { name: firstTag.name, id: firstTag.id, count: "2" },
        { name: secondTag.name, id: secondTag.id, count: "2" }
      ];

      expect(tagsAndAuditDetails).toEqual({
        tags: expectedTags,
        auditDetails: expect.anything()
      });
    });

    test("should call getQueryAuditAccessDetails when getting tags", async () => {
      await getTagsWithCountAndAuditDetails();

      expect(getQueryAuditAccessDetails).toHaveBeenCalledWith(
        expect.objectContaining({
          order: [[caseInsensitiveSort("name", models.tag), ASCENDING]]
        }),
        models.tag.name
      );
    });
  });
});
