import app from "../../server/server";
import fs from "fs";
import { Verifier } from "@pact-foundation/pact";
import path from "path";
import { cleanupDatabase } from "../../server/testHelpers/requestTestHelpers";
import models from "../../server/policeDataManager/models";
import LetterType from "../../sharedTestHelpers/letterType";
import Signer from "../../sharedTestHelpers/signer";
import { up as seedLetterFields } from "../../server/seeders/202206130000-seed-letter-fields";
import { setupCase, addCivilianComplainantToCase } from "./case-helpers";
import {
  setupLetter,
  addOfficerHistoryToReferralLetter,
  addClassificationsToCase
} from "./letter-helpers";

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
  deleteObject: jest.fn(),
  upload: jest.fn(() => ({
    promise: () => ({
      then: success => success({})
    })
  })),
  listObjectsV2: (params, callback) =>
    callback(undefined, {
      Contents: [
        {
          ETag: '"987asd6f9iuashdlkjhdf"',
          Key: "signatures/john_a_simms.png",
          LastModified: new Date(),
          Size: 11,
          StorageClass: "STANDARD"
        },
        {
          ETag: '"987asd6f9iuas23lkjhdf"',
          Key: "signatures/nina_ambroise.png",
          LastModified: new Date(),
          Size: 11,
          StorageClass: "STANDARD"
        },
        {
          ETag: '"987asd6jj3uashdlkjhdf"',
          Key: "signatures/Candy-1318242020000.png",
          LastModified: new Date(),
          Size: 11,
          StorageClass: "STANDARD"
        }
      ],
      IsTruncated: true,
      KeyCount: 3,
      MaxKeys: 3
    })
}));

const addRecommendedActions = async () => {
  await models.recommended_action.create(
    {
      id: 1,
      description:
        "Be temporarily or permanently reassigned from his/her current assignment"
    },
    { auditUser: "user" }
  );
  await models.recommended_action.create(
    {
      id: 2,
      description: "Receive training regarding any issues noted"
    },
    { auditUser: "user" }
  );
  await models.recommended_action.create(
    {
      id: 3,
      description: "Receive supervisory interventions and monitoring - INSIGHT"
    },
    { auditUser: "user" }
  );
  await models.recommended_action.create(
    {
      id: 4,
      description: "Be subject to a Fitness for Duty Assessment"
    },
    { auditUser: "user" }
  );
  await models.recommended_action.create(
    {
      id: 5,
      description: "Be the subject of Integrity Checks"
    },
    { auditUser: "user" }
  );
};

const addClassifications = async () => {
  await models.classification.create(
    {
      id: 1,
      name: "Use of Force",
      message:
        "Due to the allegation of use of force, the OIPM recommends that this allegation be classified as use of force and be investigated by the Force Investigative Team (FIT)."
    },
    { auditUser: "user" }
  );
  await models.classification.create(
    {
      id: 2,
      name: "Criminal Misconduct",
      message:
        "Due to the allegation of a possible commission of crime, false arrest, domestic violence, an unlawful search, or a civil rights violation, OIPM recommends this complaint be classified as criminal misconduct at this time."
    },
    { auditUser: "user" }
  );
  await models.classification.create(
    {
      id: 3,
      name: "Serious Misconduct",
      message:
        "Due to the allegation of possible discriminatory policing, false arrest, “planting of evidence,” untruthfulness / false statements, unlawful search, retaliation, sexual misconduct, domestic violence, or misconduct implicating the conduct of the supervisory or command leadership of the subject employee, OIPM recommends the complaint be classified as serious misconduct at this time."
    },
    { auditUser: "user" }
  );
  await models.classification.create(
    {
      id: 4,
      name: "Declines to classify",
      message: "OIPM declines to classify the complaint at this time."
    },
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

  jest.setTimeout(200000);
  test("validates the expectations of client side", async () => {
    const opts = {
      logLevel: "INFO",
      timeout: 60000,
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

        await seedLetterFields(models);
      },
      stateHandlers: {
        "Case exists": async () => {
          await setupCase();
        },
        "letter is ready for review": async () => {
          const letterCase = await setupCase();
          await Promise.all([
            setupLetter(letterCase),
            addClassifications(),
            addRecommendedActions()
          ]);
        },
        "letter is ready for review: officer history added": async () => {
          const letterCase = await setupCase();
          const letter = await setupLetter(letterCase);
          await Promise.all([
            addOfficerHistoryToReferralLetter(letter),
            addClassifications(),
            addRecommendedActions()
          ]);
        },
        "letter is ready for review: officer history added: classifications added":
          async () => {
            const letterCase = await setupCase();
            const letter = await setupLetter(letterCase);
            try {
              await Promise.all([
                addOfficerHistoryToReferralLetter(letter),
                addClassificationsToCase(letterCase)
              ]);
            } catch (e) {
              console.log(e);
              throw e;
            }
          },
        "letter is ready for review: with civilian complainant": async () => {
          const letterCase = await setupCase();
          await Promise.all([
            setupLetter(letterCase),
            addCivilianComplainantToCase(letterCase),
            addClassifications(),
            addRecommendedActions()
          ]);
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
        },
        "recommended actions are added": addRecommendedActions,
        "classifications are added": addClassifications,
        "letter is ready for review: with civilian complainant with accused officer":
          async () => {
            const letterCase = await setupCase();
            const letter = await setupLetter(letterCase);
            await Promise.all([
              addCivilianComplainantToCase(letterCase),
              addOfficerHistoryToReferralLetter(letter),
              addClassifications(),
              addRecommendedActions()
            ]);
          }
      }
    };

    const output = await new Verifier(opts).verifyProvider();
    console.log(output);
  });
});
