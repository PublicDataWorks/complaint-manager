import generateComplainantLetterAndUploadToS3 from "./generateComplainantLetterAndUploadToS3";
import {
  AUDIT_ACTION,
  AUDIT_SUBJECT,
  AUDIT_TYPE,
  CASE_STATUS,
  CIVILIAN_INITIATED,
  COMPLAINANT_LETTER
} from "../../../../../sharedUtilities/constants";
import Case from "../../../../../client/testUtilities/case";
import models from "../../../../models";
import uploadLetterToS3 from "../sharedLetterUtilities/uploadLetterToS3";
import constructFilename from "../constructFilename";
import { cleanupDatabase } from "../../../../testHelpers/requestTestHelpers";

jest.mock("../sharedLetterUtilities/uploadLetterToS3", () => jest.fn());
jest.mock("../sharedLetterUtilities/generatePdfBuffer", () =>
  jest.fn(() => {
    return "pdf buffer";
  })
);

describe("generateComplainantLetterAndUploadToS3", () => {
  let complainant, caseAttributes, existingCase;

  beforeEach(async () => {
    complainant = {
      firstName: "firstName",
      lastName: "LastName",
      createdAt: "2017-01-01 12:12:00"
    };
    caseAttributes = new Case.Builder()
      .defaultCase()
      .withId(undefined)
      .withFirstContactDate("2017-12-25")
      .withIncidentDate("2016-01-01")
      .withComplaintType(CIVILIAN_INITIATED)
      .withComplainantCivilians([complainant]);
    existingCase = await models.cases.create(caseAttributes, {
      auditUser: "test",
      include: [
        {
          model: models.civilian,
          as: "complainantCivilians",
          auditUser: "test"
        }
      ]
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

  afterEach(async () => {
    await cleanupDatabase();
  });

  test("uploads generated complainant letter to S3", async () => {
    await models.sequelize.transaction(async transaction => {
      await generateComplainantLetterAndUploadToS3(
        existingCase,
        "nickname",
        transaction
      );

      const finalPdfFilename = constructFilename(
        existingCase,
        COMPLAINANT_LETTER
      );

      const expectedFullFilename = `${existingCase.id}/${finalPdfFilename}`;
      expect(uploadLetterToS3).toHaveBeenCalledWith(
        expectedFullFilename,
        "pdf buffer",
        "noipm-complainant-letters-test"
      );
    });
  });

  test("expect complainant letter to have been created", async () => {
    let complainantLetter;
    await models.sequelize.transaction(async transaction => {
      complainantLetter = await generateComplainantLetterAndUploadToS3(
        existingCase,
        "nickname",
        transaction
      );
    });
    complainantLetter = await models.complainant_letter.findOne({
      where: { caseId: existingCase.id }
    });
    expect(complainantLetter.caseId).toEqual(existingCase.id);
    expect(complainantLetter.complainantCivilianId).toEqual(
      existingCase.complainantCivilians[0].id
    );
  });

  test("should create complainant letter with first created complainant", async () => {
    let complainant2 = {
      firstName: "secondPersonFirstname",
      lastName: "secondPersonSurname",
      createdAt: "2018-01-01 12:12:00"
    };
    caseAttributes = caseAttributes.withComplainantCivilians([
      complainant,
      complainant2
    ]);
    existingCase = await models.cases.create(caseAttributes, {
      auditUser: "test",
      include: [
        {
          model: models.civilian,
          as: "complainantCivilians",
          auditUser: "test"
        }
      ]
    });
    await existingCase.update(
      { status: CASE_STATUS.ACTIVE },
      { auditUser: "test" }
    );
    await existingCase.update(
      { status: CASE_STATUS.LETTER_IN_PROGRESS },
      { auditUser: "test" }
    );

    let complainantLetter;
    await models.sequelize.transaction(async transaction => {
      await generateComplainantLetterAndUploadToS3(
        existingCase,
        "nickname",
        transaction
      );
    });
    complainantLetter = await models.complainant_letter.findOne({
      where: { caseId: existingCase.id }
    });
    expect(complainantLetter.caseId).toEqual(existingCase.id);
    expect(complainantLetter.complainantCivilianId).toEqual(
      existingCase.complainantCivilians[0].id
    );
  });

  test("should audit complainant letter created", async () => {
    await models.sequelize.transaction(async transaction => {
      await generateComplainantLetterAndUploadToS3(
        existingCase,
        "nickname",
        transaction
      );
    });
    const actionAudit = await models.action_audit.findOne({
      where: { caseId: existingCase.id }
    });

    expect(actionAudit).toEqual(
      expect.objectContaining({
        action: AUDIT_ACTION.UPLOADED,
        auditType: AUDIT_TYPE.UPLOAD,
        caseId: existingCase.id,
        subject: AUDIT_SUBJECT.LETTER_TO_COMPLAINANT_PDF,
        user: "nickname"
      })
    );
  });
});
