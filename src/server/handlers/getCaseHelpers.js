import { BAD_REQUEST_ERRORS } from "../../sharedUtilities/errorMessageConstants";
import Boom from "boom";
import models from "../models";

export const getCaseWithAllAssociations = async (
  caseId,
  transaction = null
) => {
  let caseDetails = await getCaseData(caseId, transaction);
  return addFieldsToCaseDetails(caseDetails);
};

export const getCaseWithoutAssociations = async (
  caseId,
  transaction = null
) => {
  let caseData = await models.cases.findById(caseId, {
    paranoid: false,
    transaction
  });
  if (!caseData) {
    throw Boom.badRequest(BAD_REQUEST_ERRORS.CASE_DOES_NOT_EXIST);
  }
  return addFieldsToCaseDetails(caseData);
};

const getCaseData = async (caseId, transaction) => {
  const caseData = await models.cases.findAll({
    where: { id: caseId },
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
        model: models.civilian,
        as: "complainantCivilians",
        include: [
          models.address,
          { model: models.race_ethnicity, as: "raceEthnicity" }
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
        "ASC"
      ],
      [
        { model: models.civilian, as: "complainantCivilians" },
        "createdAt",
        "ASC"
      ],
      [
        { model: models.case_officer, as: "complainantOfficers" },
        "createdAt",
        "ASC"
      ],
      [{ model: models.civilian, as: "witnessCivilians" }, "createdAt", "ASC"],
      [
        { model: models.case_officer, as: "witnessOfficers" },
        "createdAt",
        "ASC"
      ]
    ]
  });
  if (caseData.length === 0) {
    throw Boom.badRequest(BAD_REQUEST_ERRORS.CASE_DOES_NOT_EXIST);
  }
  return caseData[0];
};

const addFieldsToCaseDetails = caseDetails => {
  let newCaseDetails = caseDetails.toJSON();

  newCaseDetails = addPdfIsAvailable(newCaseDetails);
  return addIsArchived(newCaseDetails);
};

const addIsArchived = caseDetails => {
  caseDetails.isArchived = caseDetails.deletedAt !== null;
  delete caseDetails.deletedAt;
  return caseDetails;
};
const addPdfIsAvailable = caseDetails => {
  caseDetails.pdfAvailable = pdfIsAvailable(caseDetails.referralLetter);
  delete caseDetails.referralLetter;
  return caseDetails;
};

const pdfIsAvailable = referralLetter => {
  if (!referralLetter) {
    return false;
  }
  return referralLetter.finalPdfFilename !== null;
};
