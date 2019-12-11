import ReferralLetter from "../../../../../client/complaintManager/testUtilities/ReferralLetter";
import models from "../../../../complaintManager/models";
import { cleanupDatabase } from "../../../../testHelpers/requestTestHelpers";
import timekeeper from "timekeeper";
import Case from "../../../../../client/complaintManager/testUtilities/case";
import {
  CASE_STATUS,
  CIVILIAN_INITIATED,
  COMPLAINANT,
  RANK_INITIATED
} from "../../../../../sharedUtilities/constants";
import generateReferralLetterPdfBuffer, {
  generateLetterPdfHtml
} from "./generateReferralLetterPdfBuffer";
import { generateReferralLetterBodyAndAuditDetails } from "../generateReferralLetterBodyAndAuditDetails";
import Officer from "../../../../../client/complaintManager/testUtilities/Officer";
import CaseOfficer from "../../../../../client/complaintManager/testUtilities/caseOfficer";

jest.mock("html-pdf", () => ({
  create: (html, pdfOptions) => ({
    toBuffer: callback => {
      callback(null, html);
    }
  })
}));

jest.mock("../generateReferralLetterBodyAndAuditDetails", () => {
  return {
    generateReferralLetterBodyAndAuditDetails: jest.fn(
      (caseId, transaction) => {
        return {
          referralLetterData: {},
          auditDetails: {}
        };
      }
    )
  };
});

describe("generateReferralLetterPdfBuffer", function() {
  let existingCase, referralLetter, timeOfDownload;

  afterEach(async () => {
    await cleanupDatabase();
    generateReferralLetterBodyAndAuditDetails.mockClear();
    timekeeper.reset();
  });

  beforeEach(async () => {
    timeOfDownload = new Date("2018-07-01 19:00:22 CDT");
    timekeeper.freeze(timeOfDownload);

    const officerAttributes = new Officer.Builder()
      .defaultOfficer()
      .withId(undefined);

    const officer = await models.officer.create(officerAttributes, {
      auditUser: "user"
    });

    const complainantOfficer = new CaseOfficer.Builder()
      .defaultCaseOfficer()
      .withId(undefined)
      .withOfficerId(officer.id)
      .withCreatedAt(new Date("2018-09-22"))
      .withRoleOnCase(COMPLAINANT);

    const caseAttributes = new Case.Builder()
      .defaultCase()
      .withId(12070)
      .withFirstContactDate("2017-12-25")
      .withIncidentDate("2016-01-01")
      .withComplaintType(RANK_INITIATED)
      .withComplainantOfficers([complainantOfficer]);
    existingCase = await models.cases.create(caseAttributes, {
      include: [
        {
          model: models.case_officer,
          as: "complainantOfficers",
          auditUser: "someone"
        }
      ],
      auditUser: "someone"
    });
    await existingCase.update(
      { status: CASE_STATUS.ACTIVE },
      { auditUser: "test" }
    );
    await existingCase.update(
      { status: CASE_STATUS.LETTER_IN_PROGRESS },
      { auditUser: "test" }
    );
  });

  describe("sender is 'sender address'", () => {
    beforeEach(async () => {
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
      const letterBody = "<p> Letter Body </p>";
      const pdfData = {
        referralLetter: {
          recipient: "Recipient Address",
          sender: "Sender Address\n Sender Address Second Line",
          transcribedBy: "Transcriber"
        },
        caseReference: "CC-2011-0099"
      };

      const letterPdfHtml = await generateLetterPdfHtml(
        letterBody,
        pdfData,
        false
      );
      expect(letterPdfHtml).toMatchSnapshot();
    });

    test("pdf create gets called with expected letter html when letter is generated", async () => {
      await models.sequelize.transaction(async transaction => {
        const pdfResultsAndAuditDetails = await generateReferralLetterPdfBuffer(
          existingCase.id,
          true,
          transaction
        );
        expect(pdfResultsAndAuditDetails.pdfBuffer).toMatchSnapshot();
      });
    });

    test("pdf create gets called with expected letter html when letter is edited", async () => {
      await referralLetter.update(
        { editedLetterHtml: "Custom Letter HTML" },
        { auditUser: "someone" }
      );

      await models.sequelize.transaction(async transaction => {
        const pdfResultsAndAuditDetails = await generateReferralLetterPdfBuffer(
          existingCase.id,
          true,
          transaction
        );
        expect(pdfResultsAndAuditDetails.pdfBuffer).toMatchSnapshot();
      });
    });

    test("signature is not included when sender is not stella even if includeSignature is true", async () => {
      await referralLetter.update(
        { editedLetterHtml: "Custom Letter HTML" },
        { auditUser: "someone" }
      );
      await models.sequelize.transaction(async transaction => {
        const pdfResultsAndAuditDetails = await generateReferralLetterPdfBuffer(
          existingCase.id,
          true,
          transaction
        );
        expect(pdfResultsAndAuditDetails.pdfBuffer).toMatchSnapshot();
      });
    });

    test("unedited letter generates pdf from case data", async () => {
      await models.sequelize.transaction(async transaction => {
        await generateReferralLetterPdfBuffer(
          existingCase.id,
          false,
          transaction
        );
        expect(generateReferralLetterBodyAndAuditDetails).toHaveBeenCalledWith(
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
        await generateReferralLetterPdfBuffer(
          existingCase.id,
          false,
          transaction
        );
      });
      expect(generateReferralLetterBodyAndAuditDetails).not.toHaveBeenCalled();
    });
  });

  describe("sender is stella", () => {
    beforeEach(async () => {
      const referralLetterAttributes = new ReferralLetter.Builder()
        .defaultReferralLetter()
        .withId(undefined)
        .withCaseId(existingCase.id)
        .withRecipient("recipient address")
        .withSender("Stella Cziment")
        .withTranscribedBy("transcriber")
        .withIncludeRetaliationConcerns(true);

      referralLetter = await models.referral_letter.create(
        referralLetterAttributes,
        {
          auditUser: "test"
        }
      );
    });

    test("signature is included when sender is stella and includeSignature is true", async () => {
      await models.sequelize.transaction(async transaction => {
        const pdfResultsAndAuditDetails = await generateReferralLetterPdfBuffer(
          existingCase.id,
          true,
          transaction
        );
        expect(pdfResultsAndAuditDetails.pdfBuffer).toMatchSnapshot();
      });
    });

    test("signature is not included when includeSignature is false", async () => {
      await models.sequelize.transaction(async transaction => {
        const pdfResultsAndAuditDetails = await generateReferralLetterPdfBuffer(
          existingCase.id,
          false,
          transaction
        );
        expect(pdfResultsAndAuditDetails.pdfBuffer).toMatchSnapshot();
      });
    });
  });
});
