import { createTestCaseWithCivilian } from "../../../testHelpers/modelMothers";
import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import getCaseTags from "./getCaseTags";
import models from "../../../policeDataManager/models";
import {
  AUDIT_ACTION,
  AUDIT_SUBJECT
} from "../../../../sharedUtilities/constants";

const httpMocks = require("node-mocks-http");

describe("getCaseTags", () => {
  let request, response, next, existingCase, existingTag;

  beforeEach(async () => {
    existingCase = await createTestCaseWithCivilian();

    existingTag = await models.tag.create(
      {
        name: "Tofu"
      },
      {
        auditUser: "Audrey the Osprey"
      }
    );

    await models.case_tag.create(
      {
        caseId: existingCase.id,
        tagId: existingTag.id
      },
      {
        auditUser: "Tom the Osprey"
      }
    );

    request = httpMocks.createRequest({
      method: "GET",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      params: { caseId: existingCase.id },
      nickname: "tuser"
    });

    response = httpMocks.createResponse();
    next = jest.fn();
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  test("should return case tags", async () => {
    await getCaseTags(request, response, next);

    expect(response._getData()).toEqual([
      expect.objectContaining({
        caseId: existingCase.id,
        tagId: existingTag.id,
        tag: expect.objectContaining({
          name: existingTag.name
        })
      })
    ]);
  });

  describe("auditing", () => {
    test("should audit accessing case tags", async () => {
      await getCaseTags(request, response, next);

      const audit = await models.audit.findOne({
        where: {
          referenceId: existingCase.id,
          auditAction: AUDIT_ACTION.DATA_ACCESSED
        },
        include: [
          {
            model: models.data_access_audit,
            as: "dataAccessAudit",
            include: [
              {
                model: models.data_access_value,
                as: "dataAccessValues"
              }
            ]
          }
        ]
      });

      expect(audit).toEqual(
        expect.objectContaining({
          user: "tuser",
          auditAction: AUDIT_ACTION.DATA_ACCESSED,
          referenceId: existingCase.id,
          managerType: "complaint",
          dataAccessAudit: expect.objectContaining({
            auditSubject: AUDIT_SUBJECT.CASE_TAGS,
            dataAccessValues: expect.arrayContaining([
              expect.objectContaining({
                association: "caseTag",
                fields: expect.arrayContaining(
                  Object.keys(models.case_tag.rawAttributes)
                )
              })
            ])
          })
        })
      );
    });
  });
});
