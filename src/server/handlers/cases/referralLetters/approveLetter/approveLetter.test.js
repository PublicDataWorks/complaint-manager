import httpMocks from "node-mocks-http";
import models from "../../../../models";
import moment from "moment";
import Case from "../../../../../client/testUtilities/case";
import approveLetter from "./approveLetter";
import {
  AUDIT_SUBJECT,
  CASE_STATUS,
  CIVILIAN_INITIATED,
  COMPLAINANT
} from "../../../../../sharedUtilities/constants";
import { cleanupDatabase } from "../../../../testHelpers/requestTestHelpers";
import ReferralLetter from "../../../../../client/testUtilities/ReferralLetter";
import uploadLetterToS3 from "./uploadLetterToS3";
import Boom from "boom";
import auditUpload from "./auditUpload";
import Civilian from "../../../../../client/testUtilities/civilian";
import Officer from "../../../../../client/testUtilities/Officer";
import CaseOfficer from "../../../../../client/testUtilities/caseOfficer";
import constructFilename from "../constructFilename";

jest.mock("./uploadLetterToS3", () => jest.fn());
jest.mock(
  "../sharedReferralLetterUtilities/generateLetterPdfBuffer",
  () => (caseId, transaction) => `Generated pdf for ${caseId}`
);
jest.mock(
  "../../../../checkFeatureToggleEnabled",
  () => (request, featureName) => true
);
jest.mock("./auditUpload", () => jest.fn());

describe("approveLetter", () => {
  let existingCase, request, response, next, referralLetter;

  beforeEach(async () => {
    response = httpMocks.createResponse();

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

    const caseAttributes = new Case.Builder()
      .defaultCase()
      .withId(undefined)
      .withComplaintType(CIVILIAN_INITIATED)
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
    request = httpMocks.createRequest({
      method: "PUT",
      headers: {
        authorization: "Bearer token"
      },
      params: { caseId: existingCase.id },
      nickname: "nickname"
    });
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  test("changes status to forwarded to agency", async () => {
    await elevateCaseStatusToReadyForReview(existingCase);
    await approveLetter(request, response, next);
    expect(response.statusCode).toEqual(200);
    await existingCase.reload();
    expect(existingCase.status).toEqual(CASE_STATUS.FORWARDED_TO_AGENCY);
  });

  test("does not update status or upload file if not in the right previous status", async () => {
    uploadLetterToS3.mockClear();
    await approveLetter(request, response, next);
    await existingCase.reload();
    expect(existingCase.status).toEqual(CASE_STATUS.INITIAL);
    expect(uploadLetterToS3).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(Boom.badRequest("Invalid case status"));
  });

  test("uploads generated file to S3 if letter should be generated", async () => {
    uploadLetterToS3.mockClear();
    await elevateCaseStatusToReadyForReview(existingCase);
    await approveLetter(request, response, next);
    expect(uploadLetterToS3).toHaveBeenCalledWith(
      existingCase.id,
      existingCase.caseNumber,
      existingCase.firstContactDate,
      existingCase.complainantCivilians[0].lastName,
      `Generated pdf for ${existingCase.id}`
    );
    expect(auditUpload).toHaveBeenCalledWith(
      "nickname",
      existingCase.id,
      AUDIT_SUBJECT.REFERRAL_LETTER_PDF,
      expect.any(Object)
    );
  });

  test("saves filename in database after uploading file to s3", async () => {
    uploadLetterToS3.mockClear();
    await elevateCaseStatusToReadyForReview(existingCase);
    await approveLetter(request, response, next);
    await referralLetter.reload();

    const filename = constructFilename(
      existingCase.id,
      existingCase.caseNumber,
      existingCase.firstContactDate,
      existingCase.complainantCivilians[0].lastName
    );

    expect(referralLetter.finalPdfFilename).toEqual(filename);
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
});
