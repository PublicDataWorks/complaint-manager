import { cleanupDatabase } from "../../../../testHelpers/requestTestHelpers";
import { generateReferralLetterBodyAndAuditDetails } from "../generateReferralLetterBodyAndAuditDetails";
import timekeeper from "timekeeper";
import Case from "../../../../../client/complaintManager/testUtilities/case";
import { CASE_STATUS } from "../../../../../sharedUtilities/constants";
import models from "../../../../models";
import Civilian from "../../../../../client/complaintManager/testUtilities/civilian";
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

jest.mock("../generateReferralLetterBodyAndAuditDetails");

afterEach(async () => {
  await cleanupDatabase();
  generateReferralLetterBodyAndAuditDetails.mockReset();
  timekeeper.reset();
});

beforeEach(async () => {
  timeOfDownload = new Date("2018-07-01 19:00:22 CDT");
  timekeeper.freeze(timeOfDownload);
  await models.civilian_title.create({ name: "Miss", id: 2 });
  const caseAttributes = new Case.Builder()
    .defaultCase()
    .withId(12070)
    .withFirstContactDate("2017-12-25")
    .withIncidentDate("2016-01-01");
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
      .withCivilianTitleId(2)
      .withCivilianTitle({ name: "Miss", id: 2 })
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
