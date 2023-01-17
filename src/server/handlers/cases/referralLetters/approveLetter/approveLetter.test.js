import httpMocks from "node-mocks-http";
import models from "../../../../policeDataManager/models";
import Case from "../../../../../sharedTestHelpers/case";
import approveLetter from "./approveLetter";
import {
  AUDIT_ACTION,
  AUDIT_FILE_TYPE,
  CIVILIAN_INITIATED,
  COMPLAINANT,
  COMPLAINANT_LETTER,
  REFERRAL_LETTER,
  REFERRAL_LETTER_VERSION,
  USER_PERMISSIONS
} from "../../../../../sharedUtilities/constants";
import { cleanupDatabase } from "../../../../testHelpers/requestTestHelpers";
import ReferralLetter from "../../../../testHelpers/ReferralLetter";
import uploadLetterToS3 from "../sharedLetterUtilities/uploadLetterToS3";
import Boom from "boom";
import Civilian from "../../../../../sharedTestHelpers/civilian";
import Officer from "../../../../../sharedTestHelpers/Officer";
import CaseOfficer from "../../../../../sharedTestHelpers/caseOfficer";
import constructFilename from "../constructFilename";
import { BAD_REQUEST_ERRORS } from "../../../../../sharedUtilities/errorMessageConstants";
import auditDataAccess from "../../../audits/auditDataAccess";
import _ from "lodash";
import { auditFileAction } from "../../../audits/auditFileAction";
import { seedStandardCaseStatuses } from "../../../../testHelpers/testSeeding";

const SAMPLE_FINAL_PDF_FILENAME = "some_filename.pdf";
const SAMPLE_REFERRAL_PDF_FILENAME = "referral_letter_filename.pdf";

jest.mock("../../../audits/auditFileAction");
jest.mock("../sharedLetterUtilities/uploadLetterToS3", () => jest.fn());
jest.mock("../generateLetterPdfBuffer", () => caseId => {
  return { pdfBuffer: `Generated pdf for ${caseId}`, auditDetails: {} };
});
jest.mock("../sharedLetterUtilities/auditUpload", () => jest.fn());
jest.mock("./generateComplainantLetterAndUploadToS3", () => ({
  generateComplainantLetterAndUploadToS3: jest.fn((existingCase, nickname) => {
    return {
      finalPdfFilename: "some_filename.pdf"
    };
  })
}));

jest.mock("../constructFilename", () => (existingCase, pdfLetterType) => {
  return "referral_letter_filename.pdf";
});
jest.mock("../../../audits/auditDataAccess");

describe("approveLetter", () => {
  let existingCase, request, response, next, referralLetter, statuses;

  const testUser = "Kyle Katarn";

  beforeEach(async () => {
    await cleanupDatabase();
    response = httpMocks.createResponse();

    statuses = await seedStandardCaseStatuses();

    const complainantCivilianAttributes = new Civilian.Builder()
      .defaultCivilian()
      .withId(undefined)
      .withRoleOnCase(COMPLAINANT);

    const complainantOfficerAttributes = new Officer.Builder()
      .defaultOfficer()
      .withId(undefined);

    const complainantOfficer = await models.officer.create(
      complainantOfficerAttributes,
      { auditUser: "test" }
    );

    const complainantCaseOfficerAttributes = new CaseOfficer.Builder()
      .defaultCaseOfficer()
      .withId(undefined)
      .withOfficerId(complainantOfficer.id)
      .withRoleOnCase(COMPLAINANT);

    const complaintType = await models.complaintTypes.create({
      name: CIVILIAN_INITIATED
    });
    const caseAttributes = new Case.Builder()
      .defaultCase()
      .withId(undefined)
      .withComplaintTypeId(complaintType.id)
      .withIncidentDate("2003-01-01")
      .withFirstContactDate("2004-01-01")
      .withComplainantCivilians([complainantCivilianAttributes])
      .withComplainantOfficers([complainantCaseOfficerAttributes]);

    existingCase = await models.cases.create(caseAttributes, {
      include: [
        {
          model: models.case_officer,
          as: "complainantOfficers",
          auditUser: "test"
        },
        {
          model: models.civilian,
          as: "complainantCivilians",
          auditUser: "test"
        }
      ],
      auditUser: "test"
    });

    const letterAttributes = new ReferralLetter.Builder()
      .defaultReferralLetter()
      .withId(undefined)
      .withCaseId(existingCase.id);
    referralLetter = await models.referral_letter.create(letterAttributes, {
      auditUser: "test"
    });
    next = jest.fn();
  });

  afterEach(async () => {
    await cleanupDatabase();
    uploadLetterToS3.mockClear();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  describe("user has permissions", () => {
    beforeEach(async () => {
      request = httpMocks.createRequest({
        method: "PUT",
        headers: {
          authorization: "Bearer token"
        },
        params: { caseId: existingCase.id },
        nickname: testUser,
        permissions: [`${USER_PERMISSIONS.UPDATE_ALL_CASE_STATUSES}`]
      });
    });

    test("should not audit data access if no data is returned in the response when approving letter", async () => {
      await elevateCaseStatusToReadyForReview(existingCase);
      await approveLetter(request, response, next);

      expect(auditDataAccess).not.toHaveBeenCalled();
      expect(_.isEmpty(response._getData())).toBeTruthy();
    });

    test("changes status to forwarded to agency", async () => {
      await elevateCaseStatusToReadyForReview(existingCase);
      await approveLetter(request, response, next);
      expect(response.statusCode).toEqual(200);
      await existingCase.reload();
      expect(existingCase.statusId).toEqual(
        statuses.find(status => status.name === "Forwarded to Agency").id
      );
    });

    test("does not update status or upload file if not in the right previous status", async () => {
      uploadLetterToS3.mockClear();
      await approveLetter(request, response, next);
      await existingCase.reload();
      expect(existingCase.statusId).toEqual(
        statuses.find(status => status.name === "Initial").id
      );
      expect(uploadLetterToS3).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(
        Boom.badRequest(BAD_REQUEST_ERRORS.INVALID_CASE_STATUS_FOR_UPDATE)
      );
    });

    describe("auditing", () => {
      test("audits file upload", async () => {
        uploadLetterToS3.mockClear();

        await elevateCaseStatusToReadyForReview(existingCase);
        await approveLetter(request, response, next);

        expect(auditFileAction).toHaveBeenCalledWith(
          testUser,
          existingCase.id,
          AUDIT_ACTION.UPLOADED,
          constructFilename(existingCase, REFERRAL_LETTER_VERSION.FINAL),
          AUDIT_FILE_TYPE.FINAL_REFERRAL_LETTER_PDF,
          expect.anything()
        );
      });
    });

    describe("referral letter", () => {
      test("uploads generated file to S3 if letter should be generated", async () => {
        uploadLetterToS3.mockClear();
        const filename = constructFilename(
          existingCase,
          REFERRAL_LETTER_VERSION.FINAL
        );

        const filenameWithCaseId = `${existingCase.id}/${filename}`;

        await elevateCaseStatusToReadyForReview(existingCase);
        await approveLetter(request, response, next);

        expect(uploadLetterToS3).toHaveBeenCalledWith(
          filenameWithCaseId,
          `Generated pdf for ${existingCase.id}`,
          "noipm-referral-letters-test"
        );
      });

      test("saves filename in database after uploading file to s3", async () => {
        uploadLetterToS3.mockClear();
        await elevateCaseStatusToReadyForReview(existingCase);
        await approveLetter(request, response, next);
        await referralLetter.reload();

        const filename = constructFilename(
          existingCase,
          REFERRAL_LETTER_VERSION.FINAL
        );

        expect(referralLetter.finalPdfFilename).toEqual(filename);
      });

      test("should create attachment with expected filename and caseId", async () => {
        await elevateCaseStatusToReadyForReview(existingCase);
        await approveLetter(request, response, next);
        const newAttachment = await models.attachment.findOne({
          where: { caseId: existingCase.id, description: REFERRAL_LETTER }
        });
        expect(newAttachment.caseId).toEqual(existingCase.id);
        expect(newAttachment.description).toEqual(REFERRAL_LETTER);
        expect(newAttachment.fileName).toEqual(SAMPLE_REFERRAL_PDF_FILENAME);
      });
    });

    describe("complainant letters", () => {
      test("should create attachment with expected filename and caseId", async () => {
        await elevateCaseStatusToReadyForReview(existingCase);
        await approveLetter(request, response, next);
        const newAttachment = await models.attachment.findOne({
          where: { caseId: existingCase.id, description: COMPLAINANT_LETTER }
        });
        expect(newAttachment.fileName).toEqual(SAMPLE_FINAL_PDF_FILENAME);
        expect(newAttachment.caseId).toEqual(existingCase.id);
        expect(newAttachment.description).toEqual(COMPLAINANT_LETTER);
      });
    });
  });

  describe("user does not have permissions", () => {
    beforeEach(async () => {
      request = httpMocks.createRequest({
        method: "PUT",
        headers: {
          authorization: "Bearer token"
        },
        params: { caseId: existingCase.id },
        nickname: testUser,
        permissions: []
      });
    });

    test("user cannot change case status or upload letter without permission", async () => {
      await elevateCaseStatusToReadyForReview(existingCase);

      await approveLetter(request, response, next);

      await existingCase.reload();
      expect(existingCase.statusId).toEqual(
        statuses.find(status => status.name === "Ready for Review").id
      );
      expect(uploadLetterToS3).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(
        Boom.badRequest(
          BAD_REQUEST_ERRORS.PERMISSIONS_MISSING_TO_APPROVE_LETTER
        )
      );
    });
  });

  const elevateCaseStatusToReadyForReview = async existingCase => {
    await existingCase.update(
      {
        statusId: statuses.find(status => status.name === "Ready for Review").id
      },
      { auditUser: testUser }
    );
  };
});
