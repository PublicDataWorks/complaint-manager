import Case from "../../../../../sharedTestHelpers/case";
import models from "../../../../policeDataManager/models";
import {
  AUDIT_ACTION,
  AUDIT_FILE_TYPE,
  CIVILIAN_INITIATED,
  COMPLAINANT,
  S3_GET_OBJECT,
  S3_URL_EXPIRATION
} from "../../../../../sharedUtilities/constants";
import getFinalPdfDownloadUrl from "./getFinalPdfDownloadUrl";
import { cleanupDatabase } from "../../../../testHelpers/requestTestHelpers";
import Boom from "boom";
import Civilian from "../../../../../sharedTestHelpers/civilian";
import CaseOfficer from "../../../../../sharedTestHelpers/caseOfficer";
import Officer from "../../../../../sharedTestHelpers/Officer";
import ReferralLetter from "../../../../testHelpers/ReferralLetter";
import { BAD_REQUEST_ERRORS } from "../../../../../sharedUtilities/errorMessageConstants";
import { auditFileAction } from "../../../audits/auditFileAction";
import { seedStandardCaseStatuses } from "../../../../testHelpers/testSeeding";

const config = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/serverConfig`);
const httpMocks = require("node-mocks-http");

const mockS3 = {
  getSignedUrl: jest.fn(() => Promise.resolve("url"))
};
jest.mock("../../../../createConfiguredS3Instance", () =>
  jest.fn(() => mockS3)
);

jest.mock("../../../audits/auditFileAction");

describe("getFinalPdfDownloadUrl", () => {
  let request, response, next, existingCase, referralLetter, statuses;
  const testUser = "Bob the Builder";

  beforeEach(async () => {
    await cleanupDatabase();

    statuses = await seedStandardCaseStatuses();

    const complainantCivilianAttributes = new Civilian.Builder()
      .defaultCivilian()
      .withId(undefined)
      .withRoleOnCase(COMPLAINANT);

    const complainantOfficerAttributes = new Officer.Builder()
      .defaultOfficer()
      .withId(undefined);

    const complainantOfficer = await models.officer.create(
      complainantOfficerAttributes,
      { auditUser: "test" }
    );

    const complainantCaseOfficerAttributes = new CaseOfficer.Builder()
      .defaultCaseOfficer()
      .withId(undefined)
      .withRoleOnCase(COMPLAINANT)
      .withOfficerId(complainantOfficer.id);

    const complaintType = await models.complaintTypes.create({
      name: CIVILIAN_INITIATED
    });

    const caseAttributes = new Case.Builder()
      .defaultCase()
      .withId(12070)
      .withFirstContactDate("2017-12-25")
      .withIncidentDate("2016-01-01")
      .withComplaintTypeId(complaintType.id)
      .withComplainantCivilians([complainantCivilianAttributes])
      .withComplainantOfficers([complainantCaseOfficerAttributes]);

    existingCase = await models.cases.create(caseAttributes, {
      include: [
        {
          model: models.case_officer,
          as: "complainantOfficers",
          auditUser: "test"
        },
        {
          model: models.civilian,
          as: "complainantCivilians",
          auditUser: "test"
        }
      ],
      auditUser: "test"
    });

    await existingCase.update(
      {
        statusId: statuses.find(status => status.name === "Ready for Review").id
      },
      { auditUser: "someone" }
    );

    const referralLetterAttributes = new ReferralLetter.Builder()
      .defaultReferralLetter()
      .withId(undefined)
      .withCaseId(existingCase.id)
      .withFinalPdfFilename("filename");

    referralLetter = await models.referral_letter.create(
      referralLetterAttributes,
      { auditUser: "test" }
    );

    request = httpMocks.createRequest({
      method: "GET",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      params: {
        caseId: existingCase.id
      },
      nickname: testUser
    });
    response = httpMocks.createResponse();
    next = jest.fn();
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  test("should retrieve download url for pdf", async () => {
    await existingCase.update(
      {
        statusId: statuses.find(status => status.name === "Forwarded to Agency")
          .id
      },
      { auditUser: "someone" }
    );

    await getFinalPdfDownloadUrl(request, response, next);

    const filenameWithCaseId = `${existingCase.id}/${referralLetter.finalPdfFilename}`;

    expect(mockS3.getSignedUrl).toHaveBeenCalledWith(S3_GET_OBJECT, {
      Bucket: config[process.env.NODE_ENV].referralLettersBucket,
      Key: filenameWithCaseId,
      Expires: S3_URL_EXPIRATION
    });
    expect(response._getData()).toEqual("url");
  });

  test("should retrieve download url for pdf when archived", async () => {
    await existingCase.update(
      {
        statusId: statuses.find(status => status.name === "Forwarded to Agency")
          .id
      },
      { auditUser: "someone" }
    );

    await existingCase.destroy({ auditUser: "someone" });

    await getFinalPdfDownloadUrl(request, response, next);

    const filenameWithCaseId = `${existingCase.id}/${referralLetter.finalPdfFilename}`;

    expect(mockS3.getSignedUrl).toHaveBeenCalledWith(S3_GET_OBJECT, {
      Bucket: config[process.env.NODE_ENV].referralLettersBucket,
      Key: filenameWithCaseId,
      Expires: S3_URL_EXPIRATION
    });
    expect(response._getData()).toEqual("url");
  });

  test("returns 400 bad request if case is in status before forwarded to agency", async () => {
    await getFinalPdfDownloadUrl(request, response, next);
    expect(next).toHaveBeenCalledWith(
      Boom.badRequest(BAD_REQUEST_ERRORS.INVALID_CASE_STATUS)
    );
  });

  describe("auditing", () => {
    test("access to pdf letter is audited", async () => {
      await existingCase.update(
        {
          statusId: statuses.find(
            status => status.name === "Forwarded to Agency"
          ).id
        },
        { auditUser: "someone" }
      );
      await getFinalPdfDownloadUrl(request, response, next);

      expect(auditFileAction).toHaveBeenCalledWith(
        testUser,
        existingCase.id,
        AUDIT_ACTION.DOWNLOADED,
        referralLetter.finalPdfFilename,
        AUDIT_FILE_TYPE.FINAL_REFERRAL_LETTER_PDF,
        expect.anything()
      );
    });
  });
});
