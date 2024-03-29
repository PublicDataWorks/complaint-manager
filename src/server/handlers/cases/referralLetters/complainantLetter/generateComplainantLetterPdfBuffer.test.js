import fs from "fs";
import { cleanupDatabase } from "../../../../testHelpers/requestTestHelpers";
import timekeeper from "timekeeper";
import Case from "../../../../../sharedTestHelpers/case";
import models from "../../../../policeDataManager/models";
import Civilian from "../../../../../sharedTestHelpers/civilian";
import getComplainantLetterPdfData from "./getComplainantLetterPdfData";
import generateLetterPdfBuffer from "../generateLetterPdfBuffer";
import Signer from "../../../../../sharedTestHelpers/signer";
import LetterType from "../../../../../sharedTestHelpers/letterType";
import LetterTypeLetterImage from "../../../../../sharedTestHelpers/LetterTypeLetterImage";
import LetterImage from "../../../../../sharedTestHelpers/LetterImage";
import { retrieveSignatureImage } from "../retrieveSignatureImage";
import {
  seedLetterSettings,
  seedPersonTypes,
  seedStandardCaseStatuses
} from "../../../../testHelpers/testSeeding";

let existingCase, timeOfDownload, complainant, statuses;

const SENDER_NAME = "Bobby!";
jest.mock("../../../../createConfiguredS3Instance");

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

let personTypes;

afterEach(async () => {
  await cleanupDatabase();
  timekeeper.reset();
});

afterAll(async () => {
  await models.sequelize.close();
});

beforeEach(async () => {
  await cleanupDatabase();
  personTypes = await seedPersonTypes();
  timeOfDownload = new Date("2018-07-01 12:00:22 CDT");
  timekeeper.freeze(timeOfDownload);

  await seedLetterSettings();

  complainant = new Civilian.Builder()
    .defaultCivilian()
    .withId(undefined)
    .withCivilianTitle({ name: "Miss", id: 2 })
    .withPersonType(personTypes[2].key)
    .build();

  statuses = await seedStandardCaseStatuses();

  const caseAttributes = new Case.Builder()
    .defaultCase()
    .withId(12070)
    .withFirstContactDate("2017-12-25")
    .withIncidentDate("2016-01-01")
    .withComplainantCivilians([complainant]);

  existingCase = await models.cases.create(caseAttributes, {
    include: [
      {
        model: models.civilian,
        as: "complainantCivilians",
        auditUser: "someone"
      }
    ],
    auditUser: "test"
  });

  await existingCase.update(
    {
      statusId: statuses.find(status => status.name === "Letter in Progress").id
    },
    { auditUser: "test" }
  );

  existingCase = await models.cases.findByPk(existingCase.id, {
    include: [
      {
        model: models.civilian,
        as: "complainantCivilians",
        include: ["personTypeDetails"]
      },
      {
        model: models.case_officer,
        as: "complainantOfficers",
        include: ["personTypeDetails"]
      },
      {
        model: models.caseInmate,
        as: "complainantInmates",
        include: ["personTypeDetails", "inmate"]
      }
    ]
  });

  const complainantLetterTemplate = fs.readFileSync(
    `${process.env.REACT_APP_INSTANCE_FILES_DIR}/complainantLetterPdf.tpl`
  );

  const signer = new Signer.Builder()
    .defaultSigner()
    .withName(SENDER_NAME)
    .withTitle("Chiefest Bobby!")
    .withSignatureFile("bobby.jpeg")
    .build();
  await models.sequelize.transaction(async transaction => {
    await models.signers.create(signer, { auditUser: "user", transaction });
    await models.letter_types.create(
      new LetterType.Builder()
        .defaultLetterType()
        .withType("COMPLAINANT")
        .withDefaultSender(signer)
        .withRequiredStatus(statuses[0])
        .withTemplate(complainantLetterTemplate.toString())
        .build(),
      { auditUser: "user", transaction }
    );

    await models.letter_types.create(
      new LetterType.Builder()
        .defaultLetterType()
        .withId(39933)
        .withType("REFERRAL")
        .withDefaultSender(signer)
        .withRequiredStatus(statuses[0])
        .build(),
      { auditUser: "user", transaction }
    );
  });

  const image1 = await models.letterImage.create(
    new LetterImage.Builder().defaultLetterImage().build(),
    { auditUser: "user" }
  );

  const image2 = await models.letterImage.create(
    new LetterImage.Builder()
      .defaultLetterImage()
      .withId(2)
      .withImage("smallIcon.png")
      .build(),
    { auditUser: "user" }
  );

  await models.letterTypeLetterImage.create(
    new LetterTypeLetterImage.Builder()
      .defaultLetterTypeLetterImage()
      .withImageId(image1.id)
      .build(),
    { auditUser: "user" }
  );

  await models.letterTypeLetterImage.create(
    new LetterTypeLetterImage.Builder()
      .defaultLetterTypeLetterImage()
      .withId(2)
      .withImageId(image2.id)
      .withMaxWidth("60px")
      .withName("smallIcon")
      .build(),
    { auditUser: "user" }
  );
});

describe("generateComplainantLetterPdfBuffer", function () {
  test("pdf buffer is created for complainant letter", async () => {
    const pdfResults = await models.sequelize.transaction(async transaction => {
      let result = await generateLetterPdfBuffer(
        existingCase.id,
        true,
        transaction,
        {
          getSignature: async ({ sender }) => {
            return await retrieveSignatureImage(
              sender ? sender.signatureFile : undefined
            );
          },
          type: "COMPLAINANT"
        },
        await getComplainantLetterPdfData(complainant)
      );
      return result.pdfBuffer;
    });

    expect(pdfResults).toMatchSnapshot();
  });

  // test("pdf buffer should generate complainant letter with case reference prefiC when primary complainant is anonymized", async () => {
  //   const civilian = await models.civilian.findOne({
  //     where: { caseId: existingCase.id }
  //   });
  //
  //   await models.civilian.update(
  //     {
  //       isAnonymous: true
  //     },
  //     {
  //       where: {
  //         id: civilian.id
  //       },
  //       auditUser: "test user"
  //     }
  //   );
  //   const newCase = await models.cases.findOne({
  //     where: { id: existingCase.id },
  //     include: [
  //       {
  //         model: models.civilian,
  //         as: "complainantCivilians",
  //         auditUser: "someone"
  //       }
  //     ],
  //     auditUser: "someone"
  //   });
  //
  //   const pdfResults = await generateComplainantLetterPdfBuffer(
  //     newCase,
  //     newCase.primaryComplainant
  //   );
  //   expect(pdfResults).toMatchSnapshot();
  // });
});
