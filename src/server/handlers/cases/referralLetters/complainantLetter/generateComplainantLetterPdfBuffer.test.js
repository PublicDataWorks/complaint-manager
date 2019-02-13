import { cleanupDatabase } from "../../../../testHelpers/requestTestHelpers";
import generateReferralLetterBody from "../generateReferralLetterBody";
import timekeeper from "timekeeper";
import Case from "../../../../../client/testUtilities/case";
import {
  CASE_STATUS,
  CIVILIAN_INITIATED
} from "../../../../../sharedUtilities/constants";
import models from "../../../../models";
import Civilian from "../../../../../client/testUtilities/civilian";
import generateComplainantLetterPdfBuffer, {
  generateComplainantLetterHtml
} from "./generateComplainantLetterPdfBuffer";

let existingCase, timeOfDownload;

jest.mock("html-pdf", () => ({
  create: (html, pdfOptions) => ({
    toBuffer: callback => {
      callback(null, html);
    }
  })
}));

jest.mock("../generateReferralLetterBody");

afterEach(async () => {
  await cleanupDatabase();
  generateReferralLetterBody.mockReset();
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

describe("generateComplainantLetterPdfBuffer", function() {
  let complainant;

  beforeEach(() => {
    complainant = new Civilian.Builder()
      .defaultCivilian()
      .withId(undefined)
      .build();
  });

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
});
