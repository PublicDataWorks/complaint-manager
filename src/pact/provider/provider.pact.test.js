import app from "../../server/server";
import fs from "fs";
import { Verifier } from "@pact-foundation/pact";
import path from "path";
import { cleanupDatabase } from "../../server/testHelpers/requestTestHelpers";
import models from "../../server/policeDataManager/models";
import LetterType from "../../sharedTestHelpers/letterType";
import LetterTypeLetterImage from "../../sharedTestHelpers/LetterTypeLetterImage";
import LetterImage from "../../sharedTestHelpers/letterImage";
import Signer from "../../sharedTestHelpers/signer";
import { up as seedLetterFields } from "../../server/seeders/202206130000-seed-letter-fields";
import {
  setupCase,
  addCivilianToCase,
  addComplainantOfficerToCase
} from "./case-helpers";
import {
  setupLetter,
  addOfficerHistoryToReferralLetter,
  addClassificationsToCase,
  addAccusedToCase
} from "./letter-helpers";
import Allegation from "../../sharedTestHelpers/Allegation";
import RaceEthnicity from "../../sharedTestHelpers/raceEthnicity";
import District from "../../sharedTestHelpers/District";
import Tag from "../../server/testHelpers/tag";
import CaseTag from "../../server/testHelpers/caseTag";
import IntakeSource from "../../server/testHelpers/intakeSource";
import CaseNoteAction from "../../server/testHelpers/caseNoteAction";
import CaseNote from "../../server/testHelpers/caseNote";
import HowDidYouHearAboutUsSource from "../../server/testHelpers/HowDidYouHearAboutUsSource";
import { seedStandardCaseStatuses } from "../../server/testHelpers/testSeeding";
import { COMPLAINANT, WITNESS } from "../../sharedUtilities/constants";

jest.mock(
  "../../server/handlers/cases/referralLetters/sharedLetterUtilities/uploadLetterToS3",
  () => jest.fn()
);

jest.mock(
  "../../server/getFeaturesAsync",
  () => callback =>
    callback([
      {
        id: "FEATURE",
        name: "FEATURE",
        description: "This is a feature",
        enabled: true
      }
    ])
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

const addAllegation = async () => {
  return await models.allegation.create(
    new Allegation.Builder().defaultAllegation().withId(1),
    { auditUser: "user" }
  );
};

const createTag = async () => {
  return await models.tag.create(new Tag.Builder().defaultTag().build(), {
    auditUser: "user"
  });
};

const setupCaseNoteActions = async () => {
  try {
    return [
      await models.case_note_action.create(
        new CaseNoteAction.Builder().defaultCaseNoteAction().withId(1).build(),
        { auditUser: "user" }
      )
    ];
  } catch (error) {
    console.log("ERRRRR CaseNoteAction", error);
  }
};

const setupDistricts = async () => {
  try {
    return [
      await models.district.create(
        new District.Builder().defaultDistrict().withId(1).build(),
        { auditUser: "user" }
      )
    ];
  } catch (error) {
    console.log("ERROR District", error);
  }
};

const setupHowDidYouHearAboutUsSources = async () => {
  try {
    await models.how_did_you_hear_about_us_source.create(
      new HowDidYouHearAboutUsSource.Builder()
        .defaultHowDidYouHearAboutUsSource()
        .withId(1)
        .withName("Facebook")
        .build(),
      { auditUser: "user" }
    );
  } catch (error) {
    console.log("ERRRRR HowDidYouHearAboutUsSource", error);
  }
};

const setupIntakeSources = async () => {
  try {
    await models.intake_source.create(
      new IntakeSource.Builder().defaultIntakeSource().withId(1).build(),
      { auditUser: "user" }
    );
  } catch (error) {
    console.log("ERRRRR IntakeSource", error);
  }
};

const setupRaceEthnicities = async () => {
  await models.race_ethnicity.create(
    new RaceEthnicity.Builder().defaultRaceEthnicity().withId(2).build(),
    { auditUser: "user" }
  );
};

const setupGenderIdentities = async () => {
  try {
    await models.gender_identity.create(
      { id: 1, name: "Female" },
      { auditUser: "user" }
    );
  } catch (error) {
    console.log("ERRRRR gender identity", error);
  }
};

const setupCivilianTitles = async () => {
  const title = await models.civilian_title.create(
    { id: 2, name: "Miss" },
    { auditUser: "user" }
  );
};

const setupLetterImages = async () => {
  try {
    await models.LetterImage.create(
      new LetterImage.Builder().defaultLetterImage().build(),
      { auditUser: "test" }
    );

    await models.LetterImage.create(
      new LetterImage.Builder()
        .defaultLetterImage()
        .withId(2)
        .withImage("smallIcon.png")
        .build(),
      { auditUser: "test" }
    );

    await models.LetterTypeLetterImage.create(
      new LetterTypeLetterImage.Builder()
        .defaultLetterTypeLetterImage()
        .build(),
      { auditUser: "test" }
    );

    await models.LetterTypeLetterImage.create(
      new LetterTypeLetterImage.Builder()
        .defaultLetterTypeLetterImage()
        .withImageId(2)
        .withMaxWidth("60px")
        .withName("smallIcon")
        .build(),
      { auditUser: "test" }
    );
  } catch (error) {
    console.log("ERRRRRRR LetterImage", error);
  }
};

describe("Pact Verification", () => {
  let server, statuses;
  beforeAll(() => {
    server = app.listen(8989);
  });

  afterAll(async () => {
    await cleanupDatabase();
    await models.sequelize.close();
    await server.close();
  });

  jest.setTimeout(1000000);
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

        statuses = await seedStandardCaseStatuses();

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
            .withId(1)
            .withEditableTemplate(letterBodyTemplate.toString())
            .withType("REFERRAL")
            .withTemplate(referralLetterTemplate.toString())
            .withDefaultSender(signerAttr)
            .withRequiredStatus(statuses[0])
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
            .withRequiredStatus(statuses[0])
            .build(),
          { auditUser: "test" }
        );

        await seedLetterFields(models);
      },
      stateHandlers: {
        "Case exists": async () => {
          await setupCase();
        },
        "Case exists: with civilian complainant": async () => {
          const c4se = await setupCase();
          await addCivilianToCase(c4se, COMPLAINANT);
        },
        "Case exists: with civilian witness": async () => {
          const c4se = await setupCase();
          await addCivilianToCase(c4se, WITNESS);
        },
        "letter is ready for review": async () => {
          const letterCase = await setupCase();
          await Promise.all([
            addComplainantOfficerToCase(letterCase),
            setupLetter(letterCase, statuses),
            addClassifications(),
            addRecommendedActions()
          ]);
        },
        "letter is ready for review: officer history added": async () => {
          const letterCase = await setupCase();
          const letter = await setupLetter(letterCase, statuses);
          await Promise.all([
            addComplainantOfficerToCase(letterCase),
            addOfficerHistoryToReferralLetter(letter),
            addClassifications(),
            addRecommendedActions()
          ]);
        },
        "letter is ready for review: officer history added: classifications added":
          async () => {
            const letterCase = await setupCase();
            const letter = await setupLetter(letterCase, statuses);
            try {
              await Promise.all([
                addComplainantOfficerToCase(letterCase),
                addOfficerHistoryToReferralLetter(letter),
                addClassificationsToCase(letterCase)
              ]);
            } catch (e) {
              console.log(e);
              throw e;
            }
          },
        "Case exists: race ethnicities exist: gender identities exist: civilian titles exist":
          async () => {
            const letterCase = await setupCase();
            await Promise.all([
              setupRaceEthnicities(),
              setupGenderIdentities(),
              setupCivilianTitles()
            ]);
          },
        "Case exists: race ethnicities exist: gender identities exist: civilian titles exist: with civilian complainant":
          async () => {
            const letterCase = await setupCase();
            await Promise.all([
              addCivilianToCase(letterCase, COMPLAINANT),
              setupRaceEthnicities(),
              setupGenderIdentities(),
              setupCivilianTitles()
            ]);
          },
        "Case exists: race ethnicities exist: gender identities exist: civilian titles exist: with civilian witness":
          async () => {
            const letterCase = await setupCase();
            await Promise.all([
              addCivilianToCase(letterCase, WITNESS),
              setupRaceEthnicities(),
              setupGenderIdentities(),
              setupCivilianTitles()
            ]);
          },
        "letter is ready for review: with civilian complainant": async () => {
          const letterCase = await setupCase();
          await Promise.all([
            setupLetter(letterCase, statuses),
            addComplainantOfficerToCase(letterCase),
            addCivilianToCase(letterCase, COMPLAINANT),
            addClassifications(),
            addRecommendedActions()
          ]);
        },
        "signers have been added to the database": async () => {
          await cleanupDatabase(); // need to wipe out the signer who is a default signer
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
            const letter = await setupLetter(letterCase, statuses);
            await Promise.all([
              addComplainantOfficerToCase(letterCase),
              addCivilianToCase(letterCase, COMPLAINANT),
              addOfficerHistoryToReferralLetter(letter),
              addClassifications(),
              addRecommendedActions()
            ]);
          },
        "officer history options exist": async () => {
          await models.officer_history_option.create(
            { name: "lots of history" },
            { auditUser: "user" }
          );
        },
        "allegations have been added to the database": addAllegation,
        "case has accused officer with allegations": async () => {
          try {
            const allegationPromise = addAllegation();
            const c4se = await setupCase();
            await Promise.all([
              addComplainantOfficerToCase(c4se),
              addAccusedToCase(c4se.id),
              allegationPromise
            ]);
          } catch (error) {
            console.log(error);
          }
        },
        "race ethnicities exist": setupRaceEthnicities,
        "districts exist": async () => {
          await models.district.create(
            new District.Builder()
              .defaultDistrict()
              .withName("1st District")
              .build(),
            { auditUser: "user" }
          );
        },
        "civilian-titles exist": setupCivilianTitles,
        "tags exist": createTag,
        "case has a case tag": async () => {
          try {
            const c4se = await setupCase();
            const tag = await createTag();
            await models.case_tag.create(
              new CaseTag.Builder()
                .defaultCaseTag()
                .withCaseId(c4se.id)
                .withTagId(tag.id)
                .build(),
              { auditUser: "user" }
            );
          } catch (error) {
            console.log("ERRRRR CaseTag", error);
          }
        },
        "intake sources exist": setupIntakeSources,
        "how did you hear about us sources exist":
          setupHowDidYouHearAboutUsSources,
        "case note actions exist": setupCaseNoteActions,
        "case has a case note": async () => {
          try {
            const c4se = await setupCase();
            await setupCaseNoteActions();
            await models.case_note.create(
              new CaseNote.Builder()
                .defaultCaseNote()
                .withCaseId(c4se.id)
                .withId(1)
                .withCaseNoteActionId(1)
                .build(),
              { auditUser: "user" }
            );
          } catch (error) {
            console.log("ERRRRR CaseNote", error);
          }
        },
        "gender identities exist": setupGenderIdentities,
        "Case exists; case note actions exist": async () => {
          try {
            await Promise.all([setupCase(), setupCaseNoteActions()]);
          } catch (error) {
            console.log(error);
          }
        },
        "Case exists; districts exist; intake sources exsist; how did you hear about us sources exist":
          async () => {
            try {
              await Promise.all([
                setupCase(),
                setupDistricts(),
                setupIntakeSources(),
                setupHowDidYouHearAboutUsSources()
              ]);
            } catch (error) {
              console.log(error);
            }
          },
        "Letter image exists": async () => {
          const letterCase = await setupCase();
          await Promise.all([
            await setupLetter(letterCase, statuses),
            await setupLetterImages()
          ]);
        }
      }
    };

    const output = await new Verifier(opts).verifyProvider();
    console.log(output);
  });
});
