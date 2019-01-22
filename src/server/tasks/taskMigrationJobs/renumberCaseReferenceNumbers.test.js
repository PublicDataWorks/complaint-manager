import Case from "../../../client/testUtilities/case";
import { CIVILIAN_INITIATED } from "../../../sharedUtilities/constants";
import models from "../../../server/models";
import renumberCaseReferenceNumbers from "./renumberCaseReferenceNumbers";
import { cleanupDatabase } from "../../testHelpers/requestTestHelpers";
const NEW_CASE_NUMBER_MAPPINGS = require("./renumberCaseReferenceNumbersCaseMappings")[
  process.env.NODE_ENV
];

describe("migration 002 renumber case reference numbers", () => {
  afterEach(async () => {
    await cleanupDatabase();
  });

  beforeEach(async () => {
    const beforeCreateHooks = models.cases.options.hooks.beforeCreate;
    models.cases.options.hooks.beforeCreate = [() => {}]; //temporarily disable hook that would prevent us from overriding case numbers
    await setupExistingCases();
    models.cases.options.hooks.beforeCreate = beforeCreateHooks;
  });

  test("it renumbers cases according to specified list", async () => {
    await renumberCaseReferenceNumbers();
    await expectCasesHaveBeenRenumbered();
  });

  test("it reverts cases numbers on the down migration", async () => {
    await renumberCaseReferenceNumbers();
    await expectCasesHaveBeenRenumbered();
    await renumberCaseReferenceNumbers(true);
    await expectCasesHaveBeenRenumbered(true);
  });

  test("creates audit entries for the changes", async () => {
    await renumberCaseReferenceNumbers();
    await expectAuditsToHaveBeenCreated();
  });
});

const setupExistingCases = async () => {
  for (let caseNumberMapping of NEW_CASE_NUMBER_MAPPINGS) {
    await setupExistingCase(caseNumberMapping);
  }
};

const setupExistingCase = async caseNumberMapping => {
  const caseAttributes = new Case.Builder()
    .defaultCase()
    .withId(undefined)
    .withComplaintType(CIVILIAN_INITIATED);
  caseAttributes.year = caseNumberMapping.year;
  caseAttributes.caseNumber = caseNumberMapping.number.old;
  const createdCase = await models.cases.create(caseAttributes, {
    auditUser: "test_user",
    validate: false
  });
  caseNumberMapping.createdCaseId = createdCase.id;
  expect(createdCase.caseReference).toEqual(
    `CC${caseAttributes.year}-${caseAttributes.caseNumber
      .toString()
      .padStart(4, "0")}`
  );
};

const expectCasesHaveBeenRenumbered = async revert => {
  for (let caseNumberMapping of NEW_CASE_NUMBER_MAPPINGS) {
    const updatedCase = await models.cases.findById(
      caseNumberMapping.createdCaseId
    );
    expect(updatedCase.year).toEqual(caseNumberMapping.year);
    const expectedCaseNumber = revert
      ? caseNumberMapping.number.old
      : caseNumberMapping.number.new;
    expect(updatedCase.caseNumber).toEqual(expectedCaseNumber);
  }
};

const expectAuditsToHaveBeenCreated = async () => {
  for (let caseNumberMapping of NEW_CASE_NUMBER_MAPPINGS) {
    const auditsForUpdateCase = await models.data_change_audit.findAll({
      where: {
        caseId: caseNumberMapping.createdCaseId,
        modelName: "Case",
        action: "Updated"
      }
    });
    expect(auditsForUpdateCase.length).toEqual(1);
    const auditForUpdateCase = auditsForUpdateCase[0];
    expect(auditForUpdateCase.user).toEqual("System Migration: 002");
    expect(auditForUpdateCase.changes).toEqual({
      caseNumber: {
        new: caseNumberMapping.number.new,
        previous: caseNumberMapping.number.old
      }
    });
    expect(auditForUpdateCase.snapshot).toEqual(
      expect.objectContaining({
        year: caseNumberMapping.year,
        caseNumber: caseNumberMapping.number.new
      })
    );
  }
};
