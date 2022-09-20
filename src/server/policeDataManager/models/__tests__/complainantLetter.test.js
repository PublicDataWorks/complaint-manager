import models from "../index";
import ComplainantLetter from "../../../testHelpers/complainantLetter";
import Case from "../../../../sharedTestHelpers/case";
import CaseStatus from "../../../../sharedTestHelpers/caseStatus";
import Civilian from "../../../../sharedTestHelpers/civilian";
import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";

describe("complainantLetter", () => {
  beforeEach(async () => {
    await models.caseStatus.create(
      new CaseStatus.Builder().defaultCaseStatus().build(),
      { auditUser: "user" }
    );
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  test("able to create complainant letter with only minimum requirements", async () => {
    const existingCase = await models.cases.create(
      new Case.Builder().defaultCase().withId(undefined),
      { auditUser: "someone" }
    );

    const complainantCivilianAttributes = new Civilian.Builder()
      .defaultCivilian()
      .withId(undefined)
      .withCaseId(existingCase.id);

    const complainantCivilian = await models.civilian.create(
      complainantCivilianAttributes,
      { auditUser: "someone" }
    );

    const letterAttributes = new ComplainantLetter.Builder()
      .defaultComplainantLetter()
      .withId(undefined)
      .withCaseId(existingCase.id)
      .withComplainantCivilianId(complainantCivilian.id);

    const createdLetter = await models.complainant_letter.create(
      letterAttributes,
      {
        auditUser: "someone"
      }
    );
    expect(createdLetter.finalPdfFilename).toEqual("test_pdf_filename.pdf");

    const foundLetter = await models.complainant_letter.findAll(
      {
        where: { caseId: existingCase.id }
      },
      { auditUser: "someone" }
    );

    expect(foundLetter).not.toBeNull();
  });
});
