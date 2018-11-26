import { generateLetterPdfHtml } from "./generateFullReferralLetterPdf";
import timekeeper from "timekeeper";
import Case from "../../../../../client/testUtilities/case";
import ReferralLetter from "../../../../../client/testUtilities/ReferralLetter";
import { cleanupDatabase } from "../../../../testHelpers/requestTestHelpers";
import generateReferralLetterFromCaseData from "../generateReferralLetterFromCaseData";
import models from "../../../../models";
import { CASE_STATUS } from "../../../../../sharedUtilities/constants";
import generateFullReferralLetterPdf from "./generateFullReferralLetterPdf";

jest.mock("../generateReferralLetterFromCaseData");

describe("generateFullReferralLetterPdf", () => {
  let existingCase, referralLetter;

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

  test("unedited letter generates pdf from case data", async () => {
    await models.sequelize.transaction(async transaction => {
      await generateFullReferralLetterPdf(existingCase.id, transaction);
      expect(generateReferralLetterFromCaseData).toHaveBeenCalledWith(
        existingCase.id,
        transaction
      );
    });
  });

  test("edited letter generates pdf from saved data", async () => {
    await referralLetter.update(
      {
        editedLetterHtml: "<p> edited </p>"
      },
      { auditUser: "test" }
    );
    await models.sequelize.transaction(async transaction => {
      await generateFullReferralLetterPdf(existingCase.id, transaction);
    });
    expect(generateReferralLetterFromCaseData).not.toHaveBeenCalled();
  });
});
