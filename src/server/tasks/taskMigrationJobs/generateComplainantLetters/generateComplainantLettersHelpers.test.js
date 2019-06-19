import Civilian from "../../../../client/testUtilities/civilian";
import ComplainantLetter from "../../../../client/testUtilities/complainantLetter";
import { createTestCaseWithoutCivilian } from "../../../testHelpers/modelMothers";
import {
  complainantLetterExistsInAws,
  uploadComplainantLetterToS3ForMigration
} from "./generateComplainantLettersHelpers";
import models from "../../../models";
import uploadLetterToS3 from "../../../handlers/cases/referralLetters/sharedLetterUtilities/uploadLetterToS3";
import generateComplainantLetterPdfBuffer from "../../../handlers/cases/referralLetters/complainantLetter/generateComplainantLetterPdfBuffer";
import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import CaseOfficer from "../../../../client/testUtilities/caseOfficer";
import Officer from "../../../../client/testUtilities/Officer";

const config = require("../../../config/config");

jest.mock(
  "../../../handlers/cases/referralLetters/complainantLetter/generateComplainantLetterPdfBuffer",
  () => jest.fn(() => "PDF_BUFFER")
);
jest.mock(
  "../../../handlers/cases/referralLetters/sharedLetterUtilities/uploadLetterToS3"
);

const AWS = require("aws-sdk");
jest.mock("aws-sdk");

describe("generateComplainantLettersHelpers", () => {
  let getSignedUrl, existingCase, complainantLetter;
  beforeEach(async () => {
    existingCase = await createTestCaseWithoutCivilian();

    getSignedUrl = jest.fn().mockImplementation(() => {
      return SIGNED_TEST_URL;
    });

    const headObject = jest.fn().mockImplementation((params, callback) => {
      return {
        promise: jest.fn()
      };
    });

    AWS.S3.mockImplementation(() => ({
      getSignedUrl: getSignedUrl,
      config: {
        loadFromPath: jest.fn(),
        update: jest.fn()
      },
      headObject: headObject
    }));
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  describe("uploadComplainantLetterToS3ForMigration", () => {
    test("should upload complainant letter to s3 for civilian complainant", async () => {
      const civilianAttributes = new Civilian.Builder()
        .defaultCivilian()
        .withId(undefined)
        .withCaseId(existingCase.id);
      const civilian = await models.civilian.create(civilianAttributes, {
        auditUser: "tuser"
      });
      const complainantLetterAttributes = new ComplainantLetter.Builder()
        .defaultComplainantLetter()
        .withId(undefined)
        .withCaseId(existingCase.id)
        .withComplainantCivilianId(civilian.id);

      await models.complainant_letter.create(complainantLetterAttributes, {
        auditUser: "tuser"
      });

      complainantLetter = await models.complainant_letter.findOne({
        include: [
          { model: models.civilian, as: "complainantCivilian" },
          { model: models.case_officer, as: "caseOfficers" }
        ]
      });

      await uploadComplainantLetterToS3ForMigration(complainantLetter);

      expect(generateComplainantLetterPdfBuffer).toHaveBeenCalledWith(
        expect.objectContaining({
          caseReference: existingCase.caseReference,
          firstContactDate: existingCase.firstContactDate
        }),
        expect.objectContaining({ id: civilian.id })
      );

      expect(uploadLetterToS3).toHaveBeenCalledWith(
        `${complainantLetter.caseId}/${complainantLetter.finalPdfFilename}`,
        "PDF_BUFFER",
        config[process.env.NODE_ENV].complainantLettersBucket
      );
    });

    test("should upload complainant letter to s3 for officer complainant", async () => {
      const officerAttributes = new Officer.Builder()
        .defaultOfficer()
        .withId(undefined);
      await models.officer.create(officerAttributes, {
        auditUser: "Rocky"
      });
      const caseOfficerAttributes = new CaseOfficer.Builder()
        .defaultCaseOfficer()
        .withId(undefined)
        .withCaseId(existingCase.id)
        .withOfficerAttributes(officerAttributes);
      const caseOfficer = await models.case_officer.create(
        caseOfficerAttributes,
        {
          auditUser: "Horror"
        }
      );

      const complainantLetterAttributes = new ComplainantLetter.Builder()
        .withId(undefined)
        .withCaseId(existingCase.id)
        .withComplainantOfficerId(caseOfficer.id);

      await models.complainant_letter.create(complainantLetterAttributes, {
        auditUser: "Picture Show!"
      });

      complainantLetter = await models.complainant_letter.findOne({
        include: [
          { model: models.civilian, as: "complainantCivilian" },
          { model: models.case_officer, as: "caseOfficers" }
        ]
      });

      await uploadComplainantLetterToS3ForMigration(complainantLetter);

      expect(generateComplainantLetterPdfBuffer).toHaveBeenCalledWith(
        expect.objectContaining({
          caseReference: existingCase.caseReference,
          firstContactDate: existingCase.firstContactDate
        }),
        expect.objectContaining({ id: caseOfficer.id })
      );

      expect(uploadLetterToS3).toHaveBeenCalledWith(
        `${complainantLetter.caseId}/${complainantLetter.finalPdfFilename}`,
        "PDF_BUFFER",
        config[process.env.NODE_ENV].complainantLettersBucket
      );
    });
  });

  describe("complainantLetterExistsInAws", () => {
    test("should check s3 and return false if file does not exist", async () => {
      const headObject = jest.fn().mockImplementation((params, callback) => {
        return {
          promise: () => {
            throw { code: "NotFound" };
          }
        };
      });

      AWS.S3.mockImplementation(() => ({
        getSignedUrl: getSignedUrl,
        config: {
          loadFromPath: jest.fn(),
          update: jest.fn()
        },
        headObject: headObject
      }));

      const letterExists = await complainantLetterExistsInAws(
        complainantLetter
      );

      expect(letterExists).toEqual(false);
    });

    test("should check s3 and return true if file exists", async () => {
      const letterExists = await complainantLetterExistsInAws(
        complainantLetter
      );

      expect(letterExists).toEqual(true);
    });
  });
});
