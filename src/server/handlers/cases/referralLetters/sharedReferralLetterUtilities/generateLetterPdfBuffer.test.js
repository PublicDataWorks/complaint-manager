import { generateLetterPdfHtml } from "./generateLetterPdfBuffer";
import timekeeper from "timekeeper";
import Case from "../../../../../client/testUtilities/case";
import ReferralLetter from "../../../../../client/testUtilities/ReferralLetter";
import { cleanupDatabase } from "../../../../testHelpers/requestTestHelpers";
import generateLetterBody from "../generateLetterBody";
import models from "../../../../models";
import {
  CASE_STATUS,
  CIVILIAN_INITIATED
} from "../../../../../sharedUtilities/constants";
import generateLetterPdfBuffer from "./generateLetterPdfBuffer";

jest.mock("html-pdf", () => ({
  create: (html, pdfOptions) => ({
    toBuffer: callback => {
      callback(null, html);
    }
  })
}));

jest.mock("../generateLetterBody");

describe("generateLetterPdfBuffer", () => {
  let existingCase, referralLetter, timeOfDownload;

  afterEach(async () => {
    await cleanupDatabase();
    generateLetterBody.mockReset();
    timekeeper.reset();
  });

  beforeEach(async () => {
    timeOfDownload = new Date("2018-07-01 19:00:22 CDT");
    timekeeper.freeze(timeOfDownload);
    const caseAttributes = new Case.Builder()
      .defaultCase()
      .withId(12070)
      .withFirstContactDate("2017-12-25")
      .withIncidentDate("2016-01-01")
      .withComplaintType(CIVILIAN_INITIATED);
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
  });

  describe("sender is 'sender address'", async () => {
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
        caseNumber: "CC-2011-0099"
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
        const pdfResults = await generateLetterPdfBuffer(
          existingCase.id,
          true,
          transaction
        );
        expect(pdfResults).toMatchSnapshot();
      });
    });

    test("pdf create gets called with expected letter html when letter is edited", async () => {
      await referralLetter.update(
        { editedLetterHtml: "Custom Letter HTML" },
        { auditUser: "someone" }
      );

      await models.sequelize.transaction(async transaction => {
        const pdfResults = await generateLetterPdfBuffer(
          existingCase.id,
          true,
          transaction
        );
        expect(pdfResults).toMatchSnapshot();
      });
    });

    test("signature is not included when sender is not stella even if includeSignature is true", async () => {
      await referralLetter.update(
        { editedLetterHtml: "Custom Letter HTML" },
        { auditUser: "someone" }
      );
      await models.sequelize.transaction(async transaction => {
        const pdfResults = await generateLetterPdfBuffer(
          existingCase.id,
          true,
          transaction
        );
        expect(pdfResults).toMatchSnapshot();
      });
    });

    test("unedited letter generates pdf from case data", async () => {
      await models.sequelize.transaction(async transaction => {
        await generateLetterPdfBuffer(existingCase.id, false, transaction);
        expect(generateLetterBody).toHaveBeenCalledWith(
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
        await generateLetterPdfBuffer(existingCase.id, false, transaction);
      });
      expect(generateLetterBody).not.toHaveBeenCalled();
    });
  });

  describe("sender is stella", async () => {
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
        const pdfResults = await generateLetterPdfBuffer(
          existingCase.id,
          true,
          transaction
        );
        expect(pdfResults).toMatchSnapshot();
      });
    });

    test("signature is not included when includeSignature is false", async () => {
      await models.sequelize.transaction(async transaction => {
        const pdfResults = await generateLetterPdfBuffer(
          existingCase.id,
          false,
          transaction
        );
        expect(pdfResults).toMatchSnapshot();
      });
    });
  });
});
