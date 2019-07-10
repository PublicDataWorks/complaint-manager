import { createTestCaseWithCivilian } from "../../../testHelpers/modelMothers";
import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import getCaseTags from "./getCaseTags";
import models from "../../../models";
import mockFflipObject from "../../../testHelpers/mockFflipObject";
import {
  AUDIT_ACTION,
  AUDIT_SUBJECT,
  AUDIT_TYPE
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

  describe("newAuditFeature toggle enabled", () => {
    test("should audit accessing case tags", async () => {
      request.fflip = mockFflipObject({
        newAuditFeature: true
      });
      await getCaseTags(request, response, next);

      const audit = await models.audit.findOne({
        where: {
          caseId: existingCase.id,
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
          caseId: existingCase.id,
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

  describe("newAuditFeature toggle disabled", () => {
    test("should audit accessing case notes", async () => {
      request.fflip = mockFflipObject({
        newAuditFeature: false
      });
      await getCaseTags(request, response, next);

      const actionAudit = await models.action_audit.findOne({
        where: { caseId: existingCase.id }
      });

      expect(actionAudit).toEqual(
        expect.objectContaining({
          user: "tuser",
          auditType: AUDIT_TYPE.DATA_ACCESS,
          action: AUDIT_ACTION.DATA_ACCESSED,
          subject: AUDIT_SUBJECT.CASE_TAGS,
          caseId: existingCase.id,
          auditDetails: {
            "Case Tag": ["All Case Tag Data"],
            Tag: ["All Tag Data"]
          }
        })
      );
    });
  });
});
