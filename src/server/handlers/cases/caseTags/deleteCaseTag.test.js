import httpMocks from "node-mocks-http";
import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import deleteCaseTag from "./deleteCaseTag";
import Case from "../../../../sharedTestHelpers/case";
import CaseTag from "../../../testHelpers/caseTag";
import CaseStatus from "../../../../sharedTestHelpers/caseStatus";
import tag from "../../../testHelpers/tag";
import models from "../../../policeDataManager/models";
import {
  AUDIT_SUBJECT,
  MANAGER_TYPE
} from "../../../../sharedUtilities/constants";
import auditDataAccess from "../../audits/auditDataAccess";

jest.mock("../../audits/auditDataAccess");

describe("deleteCaseTag", () => {
  let createdCase, createdCaseTag, createdTag, request, next;

  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  beforeEach(async () => {
    await cleanupDatabase();
    await models.caseStatus.create(
      new CaseStatus.Builder().defaultCaseStatus().build(),
      { auditUser: "user" }
    );

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
    await deleteCaseTag(request, response, next);

    const updatedCaseTags = await models.case_tag.findAll({
      where: { caseId: createdCase.id }
    });

    expect(updatedCaseTags).toEqual([]);
  });

  describe("auditing", () => {
    test("should audit case tags access when case tag removed", async () => {
      const response = httpMocks.createResponse();
      await deleteCaseTag(request, response, next);

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
