import { cleanupDatabase } from "../../testHelpers/requestTestHelpers";
import getQueryAuditAccessDetails from "../audits/getQueryAuditAccessDetails";
import models from "../../policeDataManager/models";
import Tag from "../../testHelpers/tag";
import getTagsAndAuditDetails from "./getTagsHelper";
import { ASCENDING } from "../../../sharedUtilities/constants";
import { caseInsensitiveSort } from "../sequelizeHelpers";

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

describe("getTagsAndAuditDetails", () => {
  let firstTag, secondTag, thirdTag, fourthTag;
  beforeEach(async () => {
    const firstTagAttributes = new Tag.Builder()
      .defaultTag()
      .withName("alabama");
    const secondTagAttributes = new Tag.Builder()
      .defaultTag()
      .withName("Aloha");
    const thirdTagAttributes = new Tag.Builder().defaultTag().withName("Zed");
    const fourthTagAttributes = new Tag.Builder().defaultTag().withName("zoo");

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
