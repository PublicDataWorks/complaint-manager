import { cleanupDatabase } from "../../testHelpers/requestTestHelpers";
import {
  AUDIT_SUBJECT,
  CASE_STATUS,
  MANAGER_TYPE
} from "../../../sharedUtilities/constants";
import Case from "../../../sharedTestHelpers/case";
import models from "../../policeDataManager/models";
import httpMocks from "node-mocks-http";
import createCaseTag from "./createCaseTag";
import Tag from "../../testHelpers/tag";
import CaseTag from "../../testHelpers/caseTag";
import auditDataAccess from "../audits/auditDataAccess";
import { BAD_DATA_ERRORS } from "../../../sharedUtilities/errorMessageConstants";
import Boom from "boom";

jest.mock("../audits/auditDataAccess");

describe("createCaseTag", () => {
  let request, response, next, createdCase, createdTag;
  const testUser = "A Test Person";

  afterEach(async () => {
    await cleanupDatabase();
  });

  beforeEach(async () => {
    const caseToCreate = new Case.Builder()
      .defaultCase()
      .withStatus(CASE_STATUS.INITIAL)
      .build();
    createdCase = await models.cases.create(caseToCreate, {
      auditUser: testUser
    });

    const tagToCreate = new Tag.Builder().defaultTag().build();
    createdTag = await models.tag.create(tagToCreate, {
      auditUser: testUser
    });

    request = httpMocks.createRequest({
      method: "POST",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      body: { tagId: createdTag.id, tagName: createdTag.name },
      params: {
        caseId: createdCase.id
      },
      nickname: testUser
    });
    response = httpMocks.createResponse();
    next = jest.fn();
  });

  test("should create new caseTag with existing case and tag", async () => {
    await createCaseTag(request, response, next);

    const caseTag = await models.case_tag.findOne();

    expect(caseTag).toEqual(
      expect.objectContaining({
        caseId: createdCase.id,
        tagId: createdTag.id
      })
    );
  });

  test("should return all case tags on case and all tags", async () => {
    const anotherTag = await models.tag.create(new Tag.Builder().defaultTag(), {
      auditUser: "testUser"
    });
    await models.case_tag.create(
      new CaseTag.Builder()
        .defaultCaseTag()
        .withCaseId(createdCase.id)
        .withTagId(anotherTag.id),
      { auditUser: "testUser" }
    );

    await createCaseTag(request, response, next);

    const expectedResponseBody = {
      caseTags: expect.toIncludeSameMembers([
        expect.objectContaining({
          tagId: createdTag.id,
          caseId: createdCase.id,
          tag: expect.objectContaining({
            name: createdTag.name
          })
        }),
        expect.objectContaining({
          tagId: anotherTag.id,
          caseId: createdCase.id,
          tag: expect.objectContaining({
            name: anotherTag.name
          })
        })
      ]),
      tags: expect.toIncludeSameMembers([
        { name: createdTag.name, id: createdTag.id },
        { name: anotherTag.name, id: anotherTag.id }
      ])
    };
    expect(response._getData()).toEqual(expectedResponseBody);
  });

  test("should create tag if new tag doesn't exist", async () => {
    const newTagName = "A New Tag";

    request.body = {
      tagId: undefined,
      tagName: newTagName
    };

    await createCaseTag(request, response, next);

    const tag = await models.tag.findOne({
      where: {
        name: newTagName
      }
    });
    const caseTag = await models.case_tag.findOne();

    expect(tag).toEqual(
      expect.objectContaining({
        name: newTagName
      })
    );
    expect(caseTag).toEqual(
      expect.objectContaining({
        caseId: createdCase.id,
        tagId: tag.id
      })
    );
  });

  describe("validateTag", () => {
    test("should throw error if tag name already exists", async () => {
      request.body = {
        tagId: undefined,
        tagName: createdTag.name
      };

      await createCaseTag(request, response, next);

      expect(next).toHaveBeenCalledWith(
        Boom.badData(BAD_DATA_ERRORS.CANNOT_CREATE_DUPLICATE_TAG)
      );
    });

    test("should throw error if tag exists on case", async () => {
      request.body = {
        tagId: createdTag.id,
        tagName: undefined
      };

      await models.case_tag.create(
        {
          caseId: createdCase.id,
          tagId: createdTag.id
        },
        {
          auditUser: testUser
        }
      );

      await createCaseTag(request, response, next);

      expect(next).toHaveBeenCalledWith(
        Boom.badData(BAD_DATA_ERRORS.TAG_ALREADY_EXISTS_ON_CASE)
      );
    });

    test("should throw error if no tag parameters provided", async () => {
      request.body = {};

      await createCaseTag(request, response, next);

      expect(next).toHaveBeenCalledWith(
        Boom.badData(BAD_DATA_ERRORS.MISSING_TAG_PARAMETERS)
      );
    });
  });

  describe("auditing", () => {
    test("should audit all tags access", async () => {
      await createCaseTag(request, response, next);

      const expectedAuditDetails = {
        tag: {
          attributes: Object.keys(models.tag.rawAttributes),
          model: models.tag.name
        }
      };

      expect(auditDataAccess).toHaveBeenCalledWith(
        request.nickname,
        null,
        MANAGER_TYPE.COMPLAINT,
        AUDIT_SUBJECT.ALL_TAGS,
        expectedAuditDetails,
        expect.anything()
      );
    });
    test("should audit that caseTags were accessed", async () => {
      await createCaseTag(request, response, next);

      const expectedAuditDetails = {
        caseTag: {
          attributes: Object.keys(models.case_tag.rawAttributes),
          model: models.case_tag.name
        },
        tag: {
          attributes: Object.keys(models.tag.rawAttributes),
          model: models.tag.name
        }
      };

      expect(auditDataAccess).toHaveBeenCalledWith(
        request.nickname,
        createdCase.id,
        MANAGER_TYPE.COMPLAINT,
        AUDIT_SUBJECT.CASE_TAGS,
        expectedAuditDetails,
        expect.anything()
      );
    });
  });
});
