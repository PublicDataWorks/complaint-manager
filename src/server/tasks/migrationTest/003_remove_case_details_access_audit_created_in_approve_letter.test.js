import { cleanupDatabase } from "../../testHelpers/requestTestHelpers";
import { createTestCaseWithCivilian } from "../../testHelpers/modelMothers";
import {
  AUDIT_ACTION,
  AUDIT_SUBJECT,
  AUDIT_TYPE,
  CASE_STATUS,
  USER_PERMISSIONS
} from "../../../sharedUtilities/constants";
import httpMocks from "node-mocks-http";
import removeCaseDetailsForApproveLetter from "../migrations/003_remove_case_details_access_audit_created_in_approve_letter";
import models from "../../models";
import mockFflipObject from "../../testHelpers/mockFflipObject";
import moment from "moment";

jest.mock(
  "../../handlers/cases/referralLetters/sharedLetterUtilities/uploadLetterToS3",
  () => jest.fn()
);
jest.mock(
  "../../handlers/cases/referralLetters/getReferralLetterPdf/generateReferralLetterPdfBuffer",
  () => caseId => {
    return { pdfBuffer: `Generated pdf for ${caseId}`, auditDetails: {} };
  }
);

describe("test remove_case_details_access_audit_created_in_approve_letter migration", () => {
  let existingCase, request, response, next;
  const testUser = "Nad";
  beforeEach(async () => {
    existingCase = await createTestCaseWithCivilian();

    await elevateCaseStatusToReadyForReview(existingCase);

    request = httpMocks.createRequest({
      method: "PUT",
      headers: {
        authorization: "Bearer token"
      },
      fflip: mockFflipObject({ newAuditFeature: false }),
      params: { caseId: existingCase.id },
      nickname: "nickname",
      permissions: [`${USER_PERMISSIONS.UPDATE_ALL_CASE_STATUSES}`]
    });

    response = httpMocks.createResponse();
    next = jest.fn();
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  describe("up", () => {
    test("should remove case details access audit between complainant letter upload and referral letter upload", async () => {
      const complaintLetterUploadAudit = await models.action_audit.create({
        action: AUDIT_ACTION.UPLOADED,
        auditType: AUDIT_TYPE.UPLOAD,
        user: testUser,
        caseId: existingCase.id,
        subject: AUDIT_SUBJECT.LETTER_TO_COMPLAINANT_PDF,
        auditDetails: null,
        createdAt: new Date("2019-04-18 20:31:29.832+00")
      });
      const caseDetailsAccessAuditToDelete = await models.action_audit.create({
        action: AUDIT_ACTION.DATA_ACCESSED,
        auditType: AUDIT_TYPE.DATA_ACCESS,
        user: testUser,
        caseId: existingCase.id,
        subject: AUDIT_SUBJECT.CASE_DETAILS,
        auditDetails: {},
        createdAt: new Date("2019-04-18 20:31:29.867+00")
      });
      const referralLetterUploadAudit = await models.action_audit.create({
        action: AUDIT_ACTION.UPLOADED,
        auditType: AUDIT_TYPE.UPLOAD,
        user: testUser,
        caseId: existingCase.id,
        subject: AUDIT_SUBJECT.FINAL_REFERRAL_LETTER_PDF,
        auditDetails: null,
        createdAt: new Date("2019-04-18 20:31:30.771+00")
      });

      await removeCaseDetailsForApproveLetter.up();

      const accessAudits = await models.action_audit.findAll({ raw: true });

      expect(accessAudits).toEqual(
        expect.toIncludeSameMembers([
          expect.objectContaining({ id: referralLetterUploadAudit.id }),
          expect.objectContaining({ id: complaintLetterUploadAudit.id })
        ])
      );
    });
  });

  describe("down", () => {
    test("should restore case details access audit between complainant letter upload and referral letter upload", async () => {
      const complaintLetterUploadAudit = await models.action_audit.create({
        action: AUDIT_ACTION.UPLOADED,
        auditType: AUDIT_TYPE.UPLOAD,
        user: testUser,
        caseId: existingCase.id,
        subject: AUDIT_SUBJECT.LETTER_TO_COMPLAINANT_PDF,
        auditDetails: null,
        createdAt: new Date("2019-04-18 20:31:29.832+00")
      });
      const referralLetterUploadAudit = await models.action_audit.create({
        action: AUDIT_ACTION.UPLOADED,
        auditType: AUDIT_TYPE.UPLOAD,
        user: testUser,
        caseId: existingCase.id,
        subject: AUDIT_SUBJECT.FINAL_REFERRAL_LETTER_PDF,
        auditDetails: null,
        createdAt: new Date("2019-04-18 20:31:30.771+00")
      });

      await removeCaseDetailsForApproveLetter.down();

      const expectedCaseDetailsAccessAudit = {
        action: AUDIT_ACTION.DATA_ACCESSED,
        auditType: AUDIT_TYPE.DATA_ACCESS,
        user: testUser,
        caseId: existingCase.id,
        subject: AUDIT_SUBJECT.CASE_DETAILS,
        auditDetails: {},
        createdAt: new Date("2019-04-18 20:31:29.833+00")
      };

      const accessAudits = await models.action_audit.findAll({ raw: true });

      const foundCaseDetailsAccessAudit = accessAudits.filter(audit => {
        return audit.action === AUDIT_ACTION.DATA_ACCESSED;
      })[0];

      expect(accessAudits).toEqual(
        expect.toIncludeSameMembers([
          expect.objectContaining({ id: referralLetterUploadAudit.id }),
          expect.objectContaining({
            ...expectedCaseDetailsAccessAudit
          }),
          expect.objectContaining({ id: complaintLetterUploadAudit.id })
        ])
      );

      expect(
        moment(foundCaseDetailsAccessAudit.createdAt).isBetween(
          moment(complaintLetterUploadAudit.createdAt),
          moment(referralLetterUploadAudit.createdAt)
        )
      ).toBeTruthy();
    });
  });
});

const elevateCaseStatusToReadyForReview = async existingCase => {
  await existingCase.update(
    { status: CASE_STATUS.ACTIVE },
    { auditUser: "nickname" }
  );
  await existingCase.update(
    { status: CASE_STATUS.LETTER_IN_PROGRESS },
    { auditUser: "nickname" }
  );
  await existingCase.update(
    { status: CASE_STATUS.READY_FOR_REVIEW },
    { auditUser: "nickname" }
  );
};
