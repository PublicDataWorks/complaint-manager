import getComplainantLetterPdfData from "./getComplainantLetterPdfData";
import fs from "fs";
import { compareLetter } from "../sharedLetterUtilities/compareLetterPDFTestUtil";
import models from "../../../../policeDataManager/models";
import Signer from "../../../../../sharedTestHelpers/signer";
import LetterType from "../../../../../sharedTestHelpers/letterType";
import { cleanupDatabase } from "../../../../testHelpers/requestTestHelpers";
import Case from "../../../../../sharedTestHelpers/case";
import generateLetterPdfBuffer from "../generateLetterPdfBuffer";
import { retrieveSignatureImage } from "../retrieveSignatureImage";

const {
  PERSON_TYPE
} = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/constants`);

const AWS = require("aws-sdk");
jest.mock("aws-sdk");

describe("Compare Generated Complainant Letter to Baseline", () => {
  const actualDateNow = Date.now.bind(global.Date);
  beforeEach(async () => {
    await cleanupDatabase();

    global.Date.now = jest.fn(() => 1530118207007);
    const signerAttr = new Signer.Builder()
      .defaultSigner()
      .withName("Nina Ambroise")
      .withTitle("Acting Police Monitor")
      .withSignatureFile("nina_ambroise.png")
      .build();
    await models.sequelize.transaction(async transaction => {
      const signer = await models.signers.create(signerAttr, {
        auditUser: "user",
        transaction
      });
      const letterAttr = new LetterType.Builder()
        .defaultLetterType()
        .withType("COMPLAINANT")
        .withDefaultSender(signer)
        .build();
      await models.letter_types.create(letterAttr, {
        auditUser: "user",
        transaction
      });
    });

    let s3 = AWS.S3.mockImplementation(() => ({
      config: {
        loadFromPath: jest.fn(),
        update: jest.fn()
      },
      getObject: jest.fn((opts, callback) =>
        callback(undefined, {
          ContentType: "image/png",
          Body: {
            toString: () =>
              fs.readFileSync(
                process.cwd() + `/localstack-seed-files/${opts.Key}`,
                "base64"
              )
          }
        })
      )
    }));
  });

  test("src/testPDFs/complainantLetter.pdf should match baseline (instance-files/tests/basePDFs/complainantLetter.pdf); pngs saved in src/testPDFs", async () => {
    const existingCase = await models.cases.create(
      new Case.Builder()
        .defaultCase()
        .withId(1)
        .withFirstContactDate("2020-01-01")
        .build(),
      { auditUser: "nickname" }
    );

    const complainant = {
      civilianTitle: {
        name: "Bobby"
      },
      firstName: "Bob",
      lastName: "Loblaw",
      address: "123 Loblaw Lane",
      email: "bob@bobloblawslawblog.net",
      officerId: "9393448",
      caseEmployeeType: PERSON_TYPE.CIVILIAN_WITHIN_PD.employeeDescription
    };

    let buffer = await models.sequelize.transaction(async transaction => {
      let result = await generateLetterPdfBuffer(
        existingCase.id,
        true,
        transaction,
        {
          hasEditPage: false,
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
          templateFile: "complainantLetterPdf.tpl"
        },
        { caseId: existingCase.id, complainant }
      );
      return result.pdfBuffer;
    });
    let file = process.cwd() + "/src/testPDFs/complainantLetter.pdf";
    fs.writeFileSync(file, buffer);

    const result = await compareLetter("complainantLetter.pdf");
    expect(result.status).toEqual("passed");
  });

  afterEach(async () => {
    global.Date.now = actualDateNow;
    await cleanupDatabase();
  });
});
