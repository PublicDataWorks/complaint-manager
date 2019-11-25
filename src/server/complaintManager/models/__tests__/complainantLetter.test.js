import models from "../index";
import ComplainantLetter from "../../../../client/complaintManager/testUtilities/complainantLetter";
import Case from "../../../../client/complaintManager/testUtilities/case";
import Civilian from "../../../../client/complaintManager/testUtilities/civilian";

describe("complainantLetter", () => {
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
