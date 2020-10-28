import { createTestCaseWithoutCivilian } from "../../../testHelpers/modelMothers";
import Officer from "../../../../sharedTestHelpers/Officer";
import CaseOfficer from "../../../../sharedTestHelpers/caseOfficer";
import Allegation from "../../../../sharedTestHelpers/Allegation";
import OfficerAllegation from "../../../../sharedTestHelpers/OfficerAllegation";
import models from "../index";
import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";

describe("officerAllegation", function () {
  let officerAllegation, allegation, createdCase, officer;
  afterEach(async function () {
    await cleanupDatabase();
  });

  beforeEach(async () => {
    createdCase = await createTestCaseWithoutCivilian();

    const officerAttributes = new Officer.Builder()
      .defaultOfficer()
      .withFirstName("full")
      .withMiddleName("name")
      .withLastName("smith")
      .withId(undefined);

    officer = await models.officer.create(officerAttributes);

    const allegationAttributes = new Allegation.Builder()
      .defaultAllegation()
      .withRule("rule1")
      .withParagraph("paragraph2")
      .withDirective("directive3")
      .withId(undefined);
    allegation = await models.allegation.create(allegationAttributes);

    const caseOfficerAttributes = new CaseOfficer.Builder()
      .defaultCaseOfficer()
      .withFirstName(officer.firstName)
      .withMiddleName(officer.middleName)
      .withLastName(officer.lastName)
      .withId(undefined)
      .withCaseId(createdCase.id)
      .withOfficerId(officer.id);
    const caseOfficer = await models.case_officer.create(
      caseOfficerAttributes,
      { auditUser: "tuser" }
    );
    const officerAllegationAttributes = new OfficerAllegation.Builder()
      .defaultOfficerAllegation()
      .withId(undefined)
      .withAllegationId(allegation.id)
      .withCaseOfficerId(caseOfficer.id);

    officerAllegation = await models.officer_allegation.create(
      officerAllegationAttributes,
      { auditUser: "tuser" }
    );
  });

  test("should get back correct caseId", async () => {
    const caseId = await officerAllegation.getCaseId();

    expect(caseId).toEqual(createdCase.id);
  });

  test("should get modelDescription back", async () => {
    const modelDescription = await officerAllegation.modelDescription();

    expect(modelDescription).toEqual([
      {
        "Officer Name": "full name smith"
      },
      { Rule: "rule1" },
      { Paragraph: "paragraph2" },
      {
        Directive: "directive3"
      }
    ]);
  });
});
