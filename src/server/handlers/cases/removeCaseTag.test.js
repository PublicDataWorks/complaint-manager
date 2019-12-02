import { cleanupDatabase } from "../../testHelpers/requestTestHelpers";
import { removeCaseTag } from "./removeCaseTag";
import Case from "../../../client/complaintManager/testUtilities/case";
import CaseTag from "../../../client/complaintManager/testUtilities/caseTag";
import tag from "../../../client/complaintManager/testUtilities/tag";
import models from "../../complaintManager/models";
import httpMocks from "node-mocks-http";
import {
  AUDIT_SUBJECT,
  MANAGER_TYPE
} from "../../../sharedUtilities/constants";
import auditDataAccess from "../audits/auditDataAccess";

jest.mock("../audits/auditDataAccess");

describe("RemoveCaseTag", () => {
  let createdCase, createdCaseTag, createdTag, request, next;

  afterEach(async () => {
    await cleanupDatabase();
  });

  beforeEach(async () => {
    const caseToCreate = new Case.Builder()
      .defaultCase()
      .withId(undefined)
      .build();

    createdCase = await models.cases.create(caseToCreate, {
      auditUser: "Hancock"
    });

    const tagToCreate = new tag.Builder().defaultTag().build();

    createdTag = await models.tag.create(tagToCreate, {
      auditUser: "Aon"
    });

    const caseTagToCreate = new CaseTag.Builder()
      .defaultCaseTag()
      .withCaseId(createdCase.id)
      .withTagId(createdTag.id)
      .build();

    createdCaseTag = await models.case_tag.create(caseTagToCreate, {
      auditUser: "Sears"
    });

    request = httpMocks.createRequest({
      method: "DELETE",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      params: {
        caseId: createdCase.id,
        caseTagId: createdCaseTag.id
      },
      nickname: "TEST_USER_NICKNAME"
    });

    next = jest.fn();
  });

  test("should delete case tag from db after case tag removed", async () => {
    const response = httpMocks.createResponse();
    await removeCaseTag(request, response, next);

    const updatedCaseTags = await models.case_tag.findAll({
      where: { caseId: createdCase.id }
    });

    expect(updatedCaseTags).toEqual([]);
  });

  describe("auditing", () => {
    test("should audit case tags access when case tag removed", async () => {
      const response = httpMocks.createResponse();
      await removeCaseTag(request, response, next);

      expect(auditDataAccess).toHaveBeenCalledWith(
        request.nickname,
        createdCase.id,
        MANAGER_TYPE.COMPLAINT,
        AUDIT_SUBJECT.CASE_TAGS,
        {
          caseTag: {
            attributes: Object.keys(models.case_tag.rawAttributes),
            model: models.case_tag.name
          },
          tag: {
            attributes: Object.keys(models.tag.rawAttributes),
            model: models.tag.name
          }
        },
        expect.anything()
      );
    });
  });
});
