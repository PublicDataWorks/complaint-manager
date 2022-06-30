import app from "../../server/server";
import fs from "fs";
import { Verifier } from "@pact-foundation/pact";
import path from "path";
import { cleanupDatabase } from "../../server/testHelpers/requestTestHelpers";
import models from "../../server/policeDataManager/models";
import Case from "../../sharedTestHelpers/case";
import Officer from "../../sharedTestHelpers/Officer";
import CaseOfficer from "../../sharedTestHelpers/caseOfficer";
import {
  ACCUSED,
  CASE_STATUS,
  COMPLAINANT
} from "../../sharedUtilities/constants";
import IntakeSource from "../../server/testHelpers/intakeSource";
import ReferralLetterCaseClassification from "../../sharedTestHelpers/ReferralLetterCaseClassification";
import ReferralLetter from "../../server/testHelpers/ReferralLetter";
import LetterOfficer from "../../server/testHelpers/LetterOfficer";
import { updateCaseStatus } from "../../server/handlers/data/queries/queryHelperFunctions";
import { random } from "lodash";
import Civilian from "../../sharedTestHelpers/civilian";
import LetterType from "../../sharedTestHelpers/letterType";
import Signer from "../../sharedTestHelpers/signer";
import { up } from "../../server/seeders/202206130000-seed-letter-fields";

jest.mock(
  "../../server/handlers/cases/referralLetters/sharedLetterUtilities/uploadLetterToS3",
  () => jest.fn()
);

const AWS = require("aws-sdk");
jest.mock("aws-sdk");

AWS.S3.mockImplementation(() => ({
  config: {
    loadFromPath: jest.fn(),
    update: jest.fn()
  },
  getObject: jest.fn((opts, callback) =>
    callback(undefined, {
      ContentType: "image/png",
      Body: fs
        .readFileSync(
          process.cwd() + `/localstack-seed-files/${opts.Key}`,
          "base64"
        )
        .toString()
    })
  ),
  upload: jest.fn(() => ({
    promise: () => ({
      then: success => success({})
    })
  }))
}));

const setupCase = async () => {
  try {
    models.cases.destroy({ where: {}, truncate: true, auditUser: "user" });

    const intakeSource = await models.intake_source.create(
      new IntakeSource.Builder().defaultIntakeSource().withId(random(5, 99999)),
      { auditUser: "user" }
    );

    const c = await models.cases.create(
      new Case.Builder()
        .defaultCase()
        .withId(1)
        .withComplaintType("Civilian Within NOPD Initiated")
        .withIntakeSourceId(intakeSource.id),
      {
        auditUser: "user"
      }
    );

    const officer = await models.officer.create(
      new Officer.Builder().defaultOfficer(),
      { auditUser: "user" }
    );

    const caseOfficer = await models.case_officer.create(
      new CaseOfficer.Builder()
        .defaultCaseOfficer()
        .withOfficerId(officer.id)
        .withCaseId(c.id)
        .withRoleOnCase(COMPLAINANT),
      { auditUser: "user" }
    );

    return c;
  } catch (e) {
    console.log(e);
  }
};

const setupLetter = async letterCase => {
  try {
    await updateCaseStatus(letterCase, CASE_STATUS.READY_FOR_REVIEW);

    const letter = await models.referral_letter.create(
      new ReferralLetter.Builder()
        .defaultReferralLetter()
        .withCaseId(letterCase.id)
        .withRecipient("King of all police")
        .withRecipientAddress("100 Main Street, North Pole")
        .withSender("The aggrieved party"),
      { auditUser: "user" }
    );
    return letter;
  } catch (e) {
    console.log(e);
  }
};

const addCivilianComplainantToCase = async theCase => {
  return await models.civilian.create(
    new Civilian.Builder()
      .defaultCivilian()
      .withCaseId(theCase.id)
      .withRoleOnCase(COMPLAINANT)
      .build(),
    { auditUser: "user" }
  );
};

const addOfficerHistoryToReferralLetter = async letter => {
  const officer = await models.officer.create(
    new Officer.Builder().defaultOfficer().withId(78291).withOfficerNumber(27),
    { auditUser: "user" }
  );

  const caseOfficer = await models.case_officer.create(
    new CaseOfficer.Builder()
      .defaultCaseOfficer()
      .withOfficerId(officer.id)
      .withCaseId(letter.caseId)
      .withRoleOnCase(ACCUSED)
      .withId(64),
    { auditUser: "user" }
  );

  const officerHistory = await models.officer_history_option.create(
    { name: "yes" },
    { auditUser: "user" }
  );

  const letterOfficer = await models.letter_officer.create(
    new LetterOfficer.Builder()
      .defaultLetterOfficer()
      .withCaseOfficerId(caseOfficer.id)
      .withOfficerHistoryOptionId(officerHistory.id),
    { auditUser: "user" }
  );
  return letterOfficer;
};
const addClassificationsToCase = async theCase => {
  const classification = await models.classification.create(
    { id: 1, name: "spongebob", message: "i'm ready" },
    { auditUser: "user" }
  );

  await models.case_classification.create(
    new ReferralLetterCaseClassification.Builder()
      .defaultReferralLetterCaseClassification()
      .withCaseId(theCase.id)
      .withClassificationId(1),
    { auditUser: "user" }
  );
};

describe("Pact Verification", () => {
  let server;
  beforeAll(() => {
    server = app.listen(8989);
  });

  afterAll(async () => {
    await cleanupDatabase();
    await models.sequelize.close();
    await server.close();
  });

  jest.setTimeout(100000);
  test("validates the expectations of client side", async () => {
    const opts = {
      logLevel: "INFO",
      providerBaseUrl: "http://localhost:8989",
      provider: "complaint-manager.server",
      providerVersion: "1.0.0",
      pactUrls: [
        path.resolve(
          __dirname,
          "../../../pact/pacts/complaint-manager.client-complaint-manager.server.json"
        )
      ],
      beforeEach: async () => {
        await cleanupDatabase();

        const signerAttr = new Signer.Builder()
          .defaultSigner()
          .withName("Nina Ambroise")
          .withNickname("Amrose@place.com")
          .withPhone("367-202-3456")
          .withTitle("Acting Police Monitor")
          .withSignatureFile("nina_ambroise.png")
          .build();
        let signer;
        await models.sequelize.transaction(async transaction => {
          signer = await models.signers.create(signerAttr, {
            auditUser: "user",
            transaction
          });
        });

        const referralLetterTemplate = fs.readFileSync(
          `${process.env.REACT_APP_INSTANCE_FILES_DIR}/referralLetterPdf.tpl`
        );

        const letterBodyTemplate = fs.readFileSync(
          `${process.env.REACT_APP_INSTANCE_FILES_DIR}/letterBody.tpl`
        );
        await models.letter_types.create(
          new LetterType.Builder()
            .defaultLetterType()
            .withEditableTemplate(letterBodyTemplate.toString())
            .withType("REFERRAL")
            .withTemplate(referralLetterTemplate.toString())
            .withDefaultSender(signerAttr)
            .build(),
          { auditUser: "test" }
        );

        const complainantLetterTemplate = fs.readFileSync(
          `${process.env.REACT_APP_INSTANCE_FILES_DIR}/complainantLetterPdf.tpl`
        );

        await models.letter_types.create(
          new LetterType.Builder()
            .defaultLetterType()
            .withId(88373)
            .withType("COMPLAINANT")
            .withTemplate(complainantLetterTemplate.toString())
            .withDefaultSender(signerAttr)
            .build(),
          { auditUser: "test" }
        );

        await up(models);
      },
      stateHandlers: {
        "Case exists": async () => {
          await setupCase();
        },
        "letter is ready for review": async () => {
          const letterCase = await setupCase();
          await setupLetter(letterCase);
        },
        "letter is ready for review: officer history added": async () => {
          const letterCase = await setupCase();
          const letter = await setupLetter(letterCase);
          await addOfficerHistoryToReferralLetter(letter);
        },
        "letter is ready for review: officer history added: classifications added":
          async () => {
            const letterCase = await setupCase();
            const letter = await setupLetter(letterCase);
            try {
              await addOfficerHistoryToReferralLetter(letter);
              await addClassificationsToCase(letterCase);
            } catch (e) {
              console.log(e);
              throw e;
            }
          },
        "letter is ready for review: with civilian complainant": async () => {
          const letterCase = await setupCase();
          await setupLetter(letterCase);
          await addCivilianComplainantToCase(letterCase);
        },
        "signers have been added to the database": async () => {
          await models.signers.create(
            new Signer.Builder()
              .defaultSigner()
              .withId(1)
              .withSignatureFile("nina_ambroise.png")
              .build(),
            { auditUser: "user" }
          );
        }
      }
    };

    const output = await new Verifier(opts).verifyProvider();
    console.log(output);
  });
});
