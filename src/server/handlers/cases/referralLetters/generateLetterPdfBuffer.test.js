import generateLetterPdfBuffer, {
  generateLetterPdfHtml
} from "./generateLetterPdfBuffer";
import fs from "fs";
import LetterType from "../../../../sharedTestHelpers/letterType";
import { retrieveSignatureImageBySigner } from "./retrieveSignatureImage";
import timekeeper from "timekeeper";
import models from "../../../policeDataManager/models";
import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import { REFERRAL_LETTER_OPTIONS } from "./getReferralLetterPdf/getReferralLetterPdfData";
import { generateReferralLetterBodyAndAuditDetails } from "./generateReferralLetterBodyAndAuditDetails";
import Officer from "../../../../sharedTestHelpers/Officer";
import CaseOfficer from "../../../../sharedTestHelpers/caseOfficer";
import Case from "../../../../sharedTestHelpers/case";
import Signer from "../../../../sharedTestHelpers/signer";
import ReferralLetter from "../../../testHelpers/ReferralLetter";
import {
  CASE_STATUS,
  COMPLAINANT,
  RANK_INITIATED
} from "../../../../sharedUtilities/constants";
const SENDER_NAME = "Bobby!";

const AWS = require("aws-sdk");
jest.mock("aws-sdk");

jest.mock("html-pdf", () => ({
  create: (html, pdfOptions) => ({
    toBuffer: callback => {
      callback(null, html);
    }
  })
}));

jest.mock("fs", () => {
  const realFs = jest.requireActual("fs");
  return {
    ...realFs,
    readFileSync: (file, format) => {
      if (format === "base64") {
        return "<<base64 encoded image>>";
      } else {
        return realFs.readFileSync(file, format);
      }
    }
  };
});

jest.mock("./generateReferralLetterBodyAndAuditDetails", () => {
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

describe("generateLetterPdfBuffer", () => {
  let timeOfDownload, existingCase, referralLetter, officer;

  afterEach(async () => {
    await cleanupDatabase();
    generateReferralLetterBodyAndAuditDetails.mockClear();
    timekeeper.reset();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  let referralLetterTemplate;
  let letterBodyTemplate;

  beforeEach(async () => {

    const signer = new Signer.Builder()
      .defaultSigner()
      .withName(SENDER_NAME)
      .build();
    await models.sequelize.transaction(async transaction => {
      await models.signers.create(signer, { auditUser: "user", transaction });
    });
    
    referralLetterTemplate = fs.readFileSync(
      `${process.env.REACT_APP_INSTANCE_FILES_DIR}/referralLetterPdf.tpl`
    );

    letterBodyTemplate = fs.readFileSync(
      `${process.env.REACT_APP_INSTANCE_FILES_DIR}/letterBody.tpl`
    );
    await models.letter_types.create(
      new LetterType.Builder()
        .defaultLetterType()
        .withEditableTemplate(letterBodyTemplate.toString())
        .withType("REFERRAL")
        .withDefaultSender(signer)
        .withTemplate(referralLetterTemplate.toString())
        .build(),
      { auditUser: "test" }
    );

    timeOfDownload = new Date("2018-07-01 12:00:22 CDT");
    timekeeper.freeze(timeOfDownload);

    let s3 = AWS.S3.mockImplementation(() => ({
      config: {
        loadFromPath: jest.fn(),
        update: jest.fn()
      },
      getObject: jest.fn((opts, callback) =>
        callback(undefined, {
          ContentType: "image/bytes",
          Body: {
            toString: () => "bytesbytesbytes"
          }
        })
      )
    }));

    const officerAttributes = new Officer.Builder()
      .defaultOfficer()
      .withId(undefined);

    officer = await models.officer.create(officerAttributes, {
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

  test("generates letter pdf html correctly", async () => {
    const letterBody = "<p> Letter Body </p>";
    const pdfData = {
      recipient: "Recipient Title and Name",
      recipientAddress: "Recipient Address",
      sender: "Sender Address\n Sender Address Second Line",
      transcribedBy: "Transcriber",
      caseReference: "CC-2011-0099"
    };

    const letterPdfHtml = await generateLetterPdfHtml(
      letterBody,
      pdfData,
      false,
      {
        getSignature: async args => {
          return await retrieveSignatureImageBySigner(args.sender);
        },
        type: 'REFERRAL'
      },
      referralLetterTemplate.toString()
    );
    expect(letterPdfHtml).toMatchSnapshot();
  });

  describe("sender is 'sender address'", () => {
    beforeEach(async () => {
      const referralLetterAttributes = new ReferralLetter.Builder()
        .defaultReferralLetter()
        .withId(undefined)
        .withCaseId(existingCase.id)
        .withRecipient("recipient title and name")
        .withRecipientAddress("recipient address")
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

    test("should update case reference prefix to AC when primary complainant is anonymized", async () => {
      await models.case_officer.update(
        {
          isAnonymous: true
        },
        {
          where: {
            officerId: officer.id
          },
          auditUser: "test user"
        }
      );
      await models.sequelize.transaction(async transaction => {
        const pdfResultsAndAuditDetails = await generateLetterPdfBuffer(
          existingCase.id,
          true,
          transaction,
          REFERRAL_LETTER_OPTIONS
        );

        expect(pdfResultsAndAuditDetails.pdfBuffer).toMatchSnapshot();
      });
    });

    test("pdf create gets called with expected letter html when letter is generated", async () => {
      await models.sequelize.transaction(async transaction => {
        const pdfResultsAndAuditDetails = await generateLetterPdfBuffer(
          existingCase.id,
          true,
          transaction,
          REFERRAL_LETTER_OPTIONS
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
        const pdfResultsAndAuditDetails = await generateLetterPdfBuffer(
          existingCase.id,
          true,
          transaction,
          REFERRAL_LETTER_OPTIONS
        );
        expect(pdfResultsAndAuditDetails.pdfBuffer).toMatchSnapshot();
      });
    });

    test("signature is not included when sender is not official sender even if includeSignature is true", async () => {
      await referralLetter.update(
        { editedLetterHtml: "Custom Letter HTML" },
        { auditUser: "someone" }
      );
      await models.sequelize.transaction(async transaction => {
        const pdfResultsAndAuditDetails = await generateLetterPdfBuffer(
          existingCase.id,
          true,
          transaction,
          REFERRAL_LETTER_OPTIONS
        );
        expect(pdfResultsAndAuditDetails.pdfBuffer).toMatchSnapshot();
      });
    });

    test("unedited letter generates pdf from case data", async () => {
      await models.sequelize.transaction(async transaction => {
        await generateLetterPdfBuffer(
          existingCase.id,
          false,
          transaction,
          REFERRAL_LETTER_OPTIONS
        );
        expect(generateReferralLetterBodyAndAuditDetails).toHaveBeenCalledWith(
          existingCase.id,
          letterBodyTemplate.toString(),
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
        await generateLetterPdfBuffer(
          existingCase.id,
          false,
          transaction,
          REFERRAL_LETTER_OPTIONS
        );
      });
      expect(generateReferralLetterBodyAndAuditDetails).not.toHaveBeenCalled();
    });
  });

  describe("sender is official sender", () => {
    beforeEach(async () => {
      const referralLetterAttributes = new ReferralLetter.Builder()
        .defaultReferralLetter()
        .withId(undefined)
        .withCaseId(existingCase.id)
        .withRecipient("recipient title and name")
        .withRecipientAddress("recipient address")
        .withSender(SENDER_NAME)
        .withTranscribedBy("transcriber")
        .withIncludeRetaliationConcerns(true);

      referralLetter = await models.referral_letter.create(
        referralLetterAttributes,
        {
          auditUser: "test"
        }
      );
    });

    test("signature is included when sender is official sender and includeSignature is true", async () => {
      await models.sequelize.transaction(async transaction => {
        const pdfResultsAndAuditDetails = await generateLetterPdfBuffer(
          existingCase.id,
          true,
          transaction,
          REFERRAL_LETTER_OPTIONS
        );
        expect(pdfResultsAndAuditDetails.pdfBuffer).toMatchSnapshot();
      });
    });

    test("signature is not included when includeSignature is false", async () => {
      await models.sequelize.transaction(async transaction => {
        const pdfResultsAndAuditDetails = await generateLetterPdfBuffer(
          existingCase.id,
          false,
          transaction,
          REFERRAL_LETTER_OPTIONS
        );
        expect(pdfResultsAndAuditDetails.pdfBuffer).toMatchSnapshot();
      });
    });
  });
});
