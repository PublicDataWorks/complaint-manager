import { BAD_REQUEST_ERRORS } from "../../sharedUtilities/errorMessageConstants";
import Boom from "boom";
import models from "../models";
import {
  addToExistingAuditDetails,
  generateAndAddAuditDetailsFromQuery,
  removeFromExistingAuditDetails
} from "./getQueryAuditAccessDetails";
import { ASCENDING } from "../../sharedUtilities/constants";

export const getCaseWithAllAssociations = async (
  caseId,
  transaction,
  auditDetails
) => {
  return await getCaseDataWithCustomFields(caseId, transaction, auditDetails);
};

const getCaseDataWithCustomFields = async (
  caseId,
  transaction,
  auditDetails
) => {
  let caseAuditDetails = {};

  let caseDetails = await getCaseData(caseId, transaction, caseAuditDetails);

  const modifiedCaseDetails = addFieldsToCaseDetails(
    caseDetails,
    caseAuditDetails
  );
  addToExistingAuditDetails(auditDetails, caseAuditDetails);

  return modifiedCaseDetails;
};

export const getCaseWithoutAssociations = async (
  caseId,
  transaction = null
) => {
  let caseData = await models.cases.findByPk(caseId, {
    paranoid: false,
    transaction
  });
  if (!caseData) {
    throw Boom.badRequest(BAD_REQUEST_ERRORS.CASE_DOES_NOT_EXIST);
  }
  return addFieldsToCaseDetails(caseData);
};

const getCaseData = async (caseId, transaction, auditDetails) => {
  const queryOptions = {
    paranoid: false,
    include: [
      {
        model: models.classification
      },
      {
        model: models.intake_source,
        as: "intakeSource"
      },
      {
        model: models.how_did_you_hear_about_us_source,
        as: "howDidYouHearAboutUsSource"
      },
      {
        model: models.civilian,
        as: "complainantCivilians",
        include: [
          models.address,
          { model: models.race_ethnicity, as: "raceEthnicity" },
          { model: models.gender_identity, as: "genderIdentity" }
        ]
      },
      {
        model: models.civilian,
        as: "witnessCivilians",
        include: [
          models.address,
          { model: models.race_ethnicity, as: "raceEthnicity" }
        ]
      },
      {
        model: models.attachment
      },
      {
        model: models.address,
        as: "incidentLocation"
      },
      {
        model: models.case_officer,
        as: "accusedOfficers",
        include: [
          {
            model: models.officer_allegation,
            as: "allegations",
            include: [models.allegation]
          }
        ]
      },
      {
        model: models.case_officer,
        as: "complainantOfficers"
      },
      {
        model: models.case_officer,
        as: "witnessOfficers"
      },
      {
        model: models.referral_letter,
        as: "referralLetter",
        attributes: ["finalPdfFilename"]
      }
    ],
    transaction: transaction,
    order: [
      [
        { model: models.case_officer, as: "accusedOfficers" },
        "createdAt",
        ASCENDING
      ],
      [
        { model: models.civilian, as: "complainantCivilians" },
        "createdAt",
        ASCENDING
      ],
      [
        { model: models.case_officer, as: "complainantOfficers" },
        "createdAt",
        ASCENDING
      ],
      [
        { model: models.civilian, as: "witnessCivilians" },
        "createdAt",
        ASCENDING
      ],
      [
        { model: models.case_officer, as: "witnessOfficers" },
        "createdAt",
        ASCENDING
      ]
    ]
  };

  const caseData = await models.cases.findByPk(caseId, queryOptions);

  generateAndAddAuditDetailsFromQuery(
    auditDetails,
    queryOptions,
    models.cases.name
  );
  return caseData;
};

const addFieldsToCaseDetails = (caseDetails, auditDetails) => {
  let newCaseDetails = caseDetails.toJSON();

  newCaseDetails = addPdfIsAvailable(newCaseDetails, auditDetails);
  return addIsArchived(newCaseDetails, auditDetails);
};

const addIsArchived = (caseDetails, auditDetails) => {
  caseDetails.isArchived = caseDetails.deletedAt !== null;
  delete caseDetails.deletedAt;

  if (auditDetails) {
    auditDetails.cases.attributes.push("isArchived");
    removeFromExistingAuditDetails(auditDetails, { cases: ["deletedAt"] });
  }

  return caseDetails;
};

const addPdfIsAvailable = (caseDetails, auditDetails) => {
  caseDetails.pdfAvailable = pdfIsAvailable(caseDetails.referralLetter);
  delete caseDetails.referralLetter;

  if (auditDetails) {
    auditDetails.cases.attributes.push("pdfAvailable");
    delete auditDetails.referralLetter;
  }

  return caseDetails;
};

const pdfIsAvailable = referralLetter => {
  if (!referralLetter) {
    return false;
  }
  return referralLetter.finalPdfFilename !== null;
};
