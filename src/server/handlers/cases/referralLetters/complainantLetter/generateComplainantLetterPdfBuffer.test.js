import fs from "fs";
import { cleanupDatabase } from "../../../../testHelpers/requestTestHelpers";
import { generateReferralLetterBodyAndAuditDetails } from "../generateReferralLetterBodyAndAuditDetails";
import timekeeper from "timekeeper";
import Case from "../../../../../sharedTestHelpers/case";
import { CASE_STATUS } from "../../../../../sharedUtilities/constants";
import models from "../../../../policeDataManager/models";
import Civilian from "../../../../../sharedTestHelpers/civilian";
import getComplainantLetterPdfData from "./getComplainantLetterPdfData";
import generateLetterPdfBuffer from "../generateLetterPdfBuffer";
import Signer from "../../../../../sharedTestHelpers/signer";
import LetterType from "../../../../../sharedTestHelpers/letterType";
import { retrieveSignatureImage } from "../retrieveSignatureImage";

let existingCase, timeOfDownload, complainant;

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

jest.mock("../generateReferralLetterBodyAndAuditDetails");

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

afterEach(async () => {
  await cleanupDatabase();
  generateReferralLetterBodyAndAuditDetails.mockReset();
  timekeeper.reset();
});

afterAll(async () => {
  await models.sequelize.close();
});

beforeEach(async () => {
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

  complainant = new Civilian.Builder()
    .defaultCivilian()
    .withId(undefined)
    .withCivilianTitle({ name: "Miss", id: 2 })
    .build();

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
    { status: CASE_STATUS.ACTIVE },
    { auditUser: "test" }
  );
  await existingCase.update(
    { status: CASE_STATUS.LETTER_IN_PROGRESS },
    { auditUser: "test" }
  );

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
        .withTemplate(complainantLetterTemplate.toString())
        .build(),
      { auditUser: "user", transaction }
    );
  });
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
          getData: async args => {
            return {
              data: await getComplainantLetterPdfData(args),
              auditDetails: {}
            };
          },
          type: "COMPLAINANT"
        },
        { caseId: existingCase.id, complainant }
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
