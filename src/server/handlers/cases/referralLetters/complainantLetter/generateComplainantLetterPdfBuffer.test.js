import { cleanupDatabase } from "../../../../testHelpers/requestTestHelpers";
import { generateReferralLetterBodyAndAuditDetails } from "../generateReferralLetterBodyAndAuditDetails";
import timekeeper from "timekeeper";
import Case from "../../../../../sharedTestHelpers/case";
import { CASE_STATUS } from "../../../../../sharedUtilities/constants";
import models from "../../../../policeDataManager/models";
import Civilian from "../../../../../sharedTestHelpers/civilian";
import generateComplainantLetterPdfBuffer, {
  generateComplainantLetterHtml
} from "./generateComplainantLetterPdfBuffer";

let existingCase, timeOfDownload, complainant;

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

afterEach(async () => {
  await cleanupDatabase();
  generateReferralLetterBodyAndAuditDetails.mockReset();
  timekeeper.reset();
});

afterAll(async () => {
  await models.sequelize.close();
});

beforeEach(async () => {
  timeOfDownload = new Date("2018-07-01 19:00:22 CDT");
  timekeeper.freeze(timeOfDownload);

  let s3 = AWS.S3.mockImplementation(() => ({
    config: {
      loadFromPath: jest.fn(),
      update: jest.fn()
    }
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
});

describe("generateComplainantLetterPdfBuffer", function () {
  test("generates complainant letter pdf html correctly", async () => {
    const letterHtml = await generateComplainantLetterHtml(
      existingCase,
      complainant
    );

    expect(letterHtml).toMatchSnapshot();
  });

  test("pdf buffer is created for complainant letter", async () => {
    const pdfResults = await generateComplainantLetterPdfBuffer(
      existingCase,
      complainant
    );

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
