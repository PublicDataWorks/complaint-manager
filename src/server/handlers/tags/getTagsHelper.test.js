import { cleanupDatabase } from "../../testHelpers/requestTestHelpers";
import getQueryAuditAccessDetails from "../audits/getQueryAuditAccessDetails";
import models from "../../models";
import Tag from "../../../client/testUtilities/tag";
import getTagsAndAuditDetails from "./getTagsHelper";
import { ASCENDING } from "../../../sharedUtilities/constants";

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
  let firstTag, secondTag;
  beforeEach(async () => {
    const firstTagAttributes = new Tag.Builder().defaultTag().withName("Aloha");
    const secondTagAttributes = new Tag.Builder().defaultTag().withName("Zed");
    secondTag = await models.tag.create(secondTagAttributes, {
      auditUser: "Person"
    });
    firstTag = await models.tag.create(firstTagAttributes, {
      auditUser: "Person"
    });
  });
  afterEach(async () => {
    await cleanupDatabase();
  });

  test("should get all tags ordered alphabetically", async () => {
    const tagsAndAuditDetails = await getTagsAndAuditDetails();
    const expectedTags = [
      [firstTag.name, firstTag.id],
      [secondTag.name, secondTag.id]
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
        order: [["name", ASCENDING]]
      }),
      models.tag.name
    );
  });
});
