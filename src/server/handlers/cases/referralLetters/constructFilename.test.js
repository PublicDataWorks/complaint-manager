import constructFilename from "./constructFilename";
import {
  LETTER_TYPE,
  REFERRAL_LETTER_VERSION
} from "../../../../sharedUtilities/constants";

describe("constructFilename", function() {
  const caseId = "5";
  const caseNumber = "CC2012-0005";
  const firstContactDate = "2012-05-05";
  const complainantLastName = "Smith";

  test("returns correct final pdf filename with complainant", () => {
    const filename = constructFilename(
      caseId,
      caseNumber,
      firstContactDate,
      complainantLastName,
      REFERRAL_LETTER_VERSION.FINAL
    );
    const expectedFilename = "5/5-5-2012_CC2012-0005_PIB_Referral_Smith.pdf";
    expect(filename).toEqual(expectedFilename);
  });

  test("returns correct final pdf filename without complainant", () => {
    const filename = constructFilename(
      caseId,
      caseNumber,
      firstContactDate,
      "",
      REFERRAL_LETTER_VERSION.FINAL
    );
    const expectedFilename = "5/5-5-2012_CC2012-0005_PIB_Referral.pdf";
    expect(filename).toEqual(expectedFilename);
  });

  test("returns correct generated preview pdf filename with complainant", () => {
    const filename = constructFilename(
      caseId,
      caseNumber,
      firstContactDate,
      complainantLastName,
      REFERRAL_LETTER_VERSION.DRAFT,
      LETTER_TYPE.GENERATED
    );
    const expectedFilename =
      "5-5-2012_CC2012-0005_Generated_Referral_Draft_Smith.pdf";
    expect(filename).toEqual(expectedFilename);
  });

  test("returns correct generated preview pdf filename without complainant", () => {
    const filename = constructFilename(
      caseId,
      caseNumber,
      firstContactDate,
      "",
      REFERRAL_LETTER_VERSION.DRAFT,
      LETTER_TYPE.GENERATED
    );
    const expectedFilename =
      "5-5-2012_CC2012-0005_Generated_Referral_Draft.pdf";
    expect(filename).toEqual(expectedFilename);
  });

  test("returns correct edited preview pdf filename with complainant", () => {
    const filename = constructFilename(
      caseId,
      caseNumber,
      firstContactDate,
      complainantLastName,
      REFERRAL_LETTER_VERSION.DRAFT,
      LETTER_TYPE.EDITED
    );
    const expectedFilename =
      "5-5-2012_CC2012-0005_Edited_Referral_Draft_Smith.pdf";
    expect(filename).toEqual(expectedFilename);
  });

  test("returns correct edited preview pdf filename without complainant", () => {
    const filename = constructFilename(
      caseId,
      caseNumber,
      firstContactDate,
      "",
      REFERRAL_LETTER_VERSION.DRAFT,
      LETTER_TYPE.EDITED
    );
    const expectedFilename = "5-5-2012_CC2012-0005_Edited_Referral_Draft.pdf";
    expect(filename).toEqual(expectedFilename);
  });
});
