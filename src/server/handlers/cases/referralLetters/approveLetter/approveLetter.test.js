import httpMocks from "node-mocks-http";
import models from "../../../../models";
import Case from "../../../../../client/testUtilities/case";
import approveLetter from "./approveLetter";
import {
  CASE_STATUS,
  CIVILIAN_INITIATED
} from "../../../../../sharedUtilities/constants";
import { cleanupDatabase } from "../../../../testHelpers/requestTestHelpers";
import ReferralLetter from "../../../../../client/testUtilities/ReferralLetter";
import uploadLetterToS3 from "./uploadLetterToS3";
import Boom from "boom";

jest.mock("./uploadLetterToS3", () => jest.fn());
jest.mock(
  "../sharedReferralLetter/generateFullReferralLetterPdf",
  () => (caseId, transaction) => `Generated pdf for ${caseId}`
);

describe("approveLetter", () => {
  let existingCase, request, response, next;

  beforeEach(async () => {
    response = httpMocks.createResponse();

    const caseAttributes = new Case.Builder()
      .defaultCase()
      .withId(undefined)
      .withComplaintType(CIVILIAN_INITIATED)
      .withIncidentDate("2003-01-01");
    existingCase = await models.cases.create(caseAttributes, {
      auditUser: "test"
    });

    const letterAttributes = new ReferralLetter.Builder()
      .defaultReferralLetter()
      .withId(undefined)
      .withCaseId(existingCase.id);
    await models.referral_letter.create(letterAttributes, {
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
      `Generated pdf for ${existingCase.id}`
    );
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
