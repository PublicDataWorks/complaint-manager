import { cleanupDatabase } from "../../../../testHelpers/requestTestHelpers";
import Case from "../../../../../client/testUtilities/case";
import models from "../../../../models";
import { CASE_STATUS } from "../../../../../sharedUtilities/constants";
import httpMocks from "node-mocks-http";
import ReferralLetter from "../../../../../client/testUtilities/ReferralLetter";
import generatePdf, { generateLetterPdfHtml } from "./generatePdf";
import timekeeper from "timekeeper";
import pdf from "html-pdf";

jest.mock("html-pdf");
jest.mock("../generateReferralLetterFromCaseData");

import generateReferralLetterFromCaseData from "../generateReferralLetterFromCaseData";

describe("Generate referral letter pdf", () => {
  const mockStore = { generateReferralLetterFromCaseData: jest.fn() };
  let existingCase, request, response, next, referralLetter;

  afterEach(async () => {
    await cleanupDatabase();
    generateReferralLetterFromCaseData.mockReset();
  });

  beforeEach(async () => {
    const caseAttributes = new Case.Builder()
      .defaultCase()
      .withId(12070)
      .withFirstContactDate("2017-12-25");
    existingCase = await models.cases.create(caseAttributes, {
      auditUser: "test"
    });
    await existingCase.update(
      { status: CASE_STATUS.ACTIVE },
      { auditUser: "test" }
    );
    await existingCase.update(
      { status: CASE_STATUS.LETTER_IN_PROGRESS },
      { auditUser: "test" }
    );

    request = httpMocks.createRequest({
      method: "GET",
      headers: {
        authorization: "Bearer token"
      },
      params: { caseId: existingCase.id },
      nickname: "bobjo"
    });

    const referralLetterAttributes = new ReferralLetter.Builder()
      .defaultReferralLetter()
      .withId(undefined)
      .withCaseId(existingCase.id)
      .withRecipient("recipient address")
      .withSender("sender address")
      .withTranscribedBy("transcriber")
      .withIncludeRetaliationConcerns(true);

    referralLetter = await models.referral_letter.create(
      referralLetterAttributes,
      {
        auditUser: "test"
      }
    );

    response = httpMocks.createResponse();
    next = jest.fn();
  });

  test("generates letter pdf html correctly", async () => {
    const timeOfDownload = new Date("2018-07-01 19:00:22 CDT");
    timekeeper.freeze(timeOfDownload);
    const letterBody = "<p> Letter Body </p>";
    const pdfData = {
      referralLetter: {
        recipient: "Recipient Address",
        sender: "Sender Address\n Sender Address Second Line",
        transcribedBy: "Transcriber"
      },
      complaintType: "person",
      incidentDate: "2011-04-09"
    };

    const letterPdfHtml = await generateLetterPdfHtml(
      letterBody,
      pdfData,
      existingCase.id
    );
    expect(letterPdfHtml).toMatchSnapshot();
  });

  test("pdf create function called when letter pdf generated", async () => {
    pdf.create.mockImplementation((letterHtml, addresses) => {
      return "";
    });
    await generatePdf(request, response, next);
    expect(pdf.create).toHaveBeenCalled();
  });

  test("unedited letter generates pdf from case data", async () => {
    await generatePdf(request, response, next);
    expect(generateReferralLetterFromCaseData).toHaveBeenCalled();
  });

  test("edited letter generates pdf from saved data", async () => {
    await referralLetter.update(
      {
        editedLetterHtml: "<p> edited </p>"
      },
      { auditUser: "test" }
    );
    await generatePdf(request, response, next);
    expect(generateReferralLetterFromCaseData).not.toHaveBeenCalled();
  });
});
