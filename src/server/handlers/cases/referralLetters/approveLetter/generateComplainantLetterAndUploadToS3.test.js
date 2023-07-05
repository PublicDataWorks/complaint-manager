import fs from "fs";
import { generateComplainantLetterAndUploadToS3 } from "./generateComplainantLetterAndUploadToS3";
import {
  AUDIT_ACTION,
  AUDIT_FILE_TYPE,
  CIVILIAN_INITIATED,
  COMPLAINANT_LETTER
} from "../../../../../sharedUtilities/constants";
import Case from "../../../../../sharedTestHelpers/case";
import LetterType from "../../../../../sharedTestHelpers/letterType";
import Signer from "../../../../../sharedTestHelpers/signer";
import models from "../../../../policeDataManager/models";
import uploadLetterToS3 from "../sharedLetterUtilities/uploadLetterToS3";
import constructFilename from "../constructFilename";
import { cleanupDatabase } from "../../../../testHelpers/requestTestHelpers";
import { auditFileAction } from "../../../audits/auditFileAction";
import {
  seedPersonTypes,
  seedStandardCaseStatuses
} from "../../../../testHelpers/testSeeding";
import createConfiguredS3Instance from "../../../../createConfiguredS3Instance";

jest.mock("../sharedLetterUtilities/uploadLetterToS3", () => jest.fn());
jest.mock("../sharedLetterUtilities/generatePdfBuffer", () =>
  jest.fn(() => {
    return "pdf buffer";
  })
);
jest.mock("../../../audits/auditFileAction");

jest.mock("../../../../createConfiguredS3Instance");
let s3 = createConfiguredS3Instance();
s3.getObject.mockImplementation((opts, callback) =>
  callback(undefined, {
    ContentType: "image/png",
    Body: fs
      .readFileSync(
        process.cwd() + "/localstack-seed-files/signatures/nina_ambroise.png",
        "base64"
      )
      .toString()
  })
);

describe("generateComplainantLetterAndUploadToS3", () => {
  let complainant, caseAttributes, existingCase, statuses, personTypes, signer;

  beforeEach(async () => {
    await cleanupDatabase();
    const signerAttr = new Signer.Builder()
      .defaultSigner()
      .withName("Nina Ambroise")
      .withTitle("Acting Police Monitor")
      .withSignatureFile("stella_cziment.png")
      .build();
    await models.sequelize.transaction(async transaction => {
      signer = await models.signers.create(signerAttr, {
        auditUser: "user",
        transaction
      });
    });

    const complainantLetterTemplate = fs.readFileSync(
      `${process.env.REACT_APP_INSTANCE_FILES_DIR}/complainantLetterPdf.tpl`
    );

    statuses = await seedStandardCaseStatuses();
    personTypes = await seedPersonTypes();

    await models.letter_types.create(
      new LetterType.Builder()
        .defaultLetterType()
        .withId(88373)
        .withType("COMPLAINANT")
        .withTemplate(complainantLetterTemplate.toString())
        .withDefaultSender(signerAttr)
        .withRequiredStatus(statuses[0])
        .build(),
      { auditUser: "test" }
    );

    await models.letter_types.create(
      new LetterType.Builder()
        .defaultLetterType()
        .withType("REFERRAL")
        .withDefaultSender(signerAttr)
        .withRequiredStatus(statuses[0])
        .build(),
      { auditUser: "test" }
    );

    complainant = {
      firstName: "firstName",
      lastName: "LastName",
      createdAt: "2017-01-01 12:12:00",
      personType: personTypes[2].key
    };

    const complaintType = await models.complaintTypes.create({
      name: CIVILIAN_INITIATED
    });

    caseAttributes = new Case.Builder()
      .defaultCase()
      .withId(undefined)
      .withFirstContactDate("2017-12-25")
      .withIncidentDate("2016-01-01")
      .withComplaintTypeId(complaintType.id)
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
      {
        statusId: statuses.find(status => status.name === "Letter in Progress")
          .id
      },
      { auditUser: "test" }
    );

    existingCase = await models.cases.findByPk(existingCase.id, {
      include: [
        {
          model: models.civilian,
          as: "complainantCivilians",
          include: ["personTypeDetails"]
        },
        {
          model: models.case_officer,
          as: "complainantOfficers",
          include: ["personTypeDetails"]
        },
        {
          model: models.caseInmate,
          as: "complainantInmates",
          include: ["personTypeDetails"]
        },
        {
          model: models.personType,
          as: "defaultPersonType"
        }
      ]
    });
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
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
    signer.update({ signatureFile: "" }, { auditUser: "user" });
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
      {
        statusId: statuses.find(status => status.name === "Letter in Progress")
          .id
      },
      { auditUser: "test" }
    );

    existingCase = await models.cases.findByPk(existingCase.id, {
      include: [
        {
          model: models.civilian,
          as: "complainantCivilians",
          include: ["personTypeDetails"]
        },
        {
          model: models.case_officer,
          as: "complainantOfficers",
          include: ["personTypeDetails"]
        },
        {
          model: models.caseInmate,
          as: "complainantInmates",
          include: ["personTypeDetails"]
        },
        {
          model: models.personType,
          as: "defaultPersonType"
        }
      ]
    });

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

  describe("auditing", () => {
    test("should audit complainant letter created", async () => {
      await models.sequelize.transaction(async transaction => {
        await generateComplainantLetterAndUploadToS3(
          existingCase,
          "nickname",
          transaction
        );
      });

      expect(auditFileAction).toHaveBeenCalledWith(
        "nickname",
        existingCase.id,
        AUDIT_ACTION.UPLOADED,
        constructFilename(existingCase, COMPLAINANT_LETTER),
        AUDIT_FILE_TYPE.LETTER_TO_COMPLAINANT_PDF,
        expect.anything()
      );
    });
  });
});
