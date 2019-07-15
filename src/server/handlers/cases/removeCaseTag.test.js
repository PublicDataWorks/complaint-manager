import { cleanupDatabase } from "../../testHelpers/requestTestHelpers";
import mockFflipObject from "../../testHelpers/mockFflipObject";
import { removeCaseTag } from "./removeCaseTag";
import Case from "../../../client/testUtilities/case";
import CaseTag from "../../../client/testUtilities/caseTag";
import tag from "../../../client/testUtilities/tag";
import models from "../../models";
import httpMocks from "node-mocks-http";
import {
  AUDIT_ACTION,
  AUDIT_SUBJECT,
  AUDIT_TYPE
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

  describe("newAuditFeature disabled", () => {
    test("should audit case tags access when case tag removed", async () => {
      request.fflip = mockFflipObject({
        newAuditFeature: false
      });

      const response = httpMocks.createResponse();
      await removeCaseTag(request, response, next);

      const actionAudit = await models.action_audit.findAll({
        where: { caseId: createdCase.id }
      });

      expect(actionAudit).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            user: "TEST_USER_NICKNAME",
            auditType: AUDIT_TYPE.DATA_ACCESS,
            action: AUDIT_ACTION.DATA_ACCESSED,
            subject: AUDIT_SUBJECT.CASE_TAGS,
            caseId: createdCase.id,
            auditDetails: {
              "Case Tag": ["All Case Tag Data"],
              Tag: ["All Tag Data"]
            }
          })
        ])
      );
    });
  });

  describe("newAuditFeature enabled", () => {
    test("should audit case tags access when case tag removed", async () => {
      request.fflip = mockFflipObject({
        newAuditFeature: true
      });

      const response = httpMocks.createResponse();
      await removeCaseTag(request, response, next);

      expect(auditDataAccess).toHaveBeenCalledWith(
        request.nickname,
        createdCase.id,
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
