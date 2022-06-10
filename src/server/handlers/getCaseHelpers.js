import { BAD_REQUEST_ERRORS } from "../../sharedUtilities/errorMessageConstants";
import Boom from "boom";
import models from "../policeDataManager/models";
import getQueryAuditAccessDetails, {
  removeFromExistingAuditDetails
} from "./audits/getQueryAuditAccessDetails";
import { ASCENDING, USER_PERMISSIONS } from "../../sharedUtilities/constants";

export const getCaseWithAllAssociationsAndAuditDetails = async (
  caseId,
  transaction,
  permissions
) => {
  const caseDetailsAndAuditDetails = await getCaseDetailsAndAuditDetails(
    caseId,
    transaction,
    permissions
  );

  const caseDetails = caseDetailsAndAuditDetails.caseDetails;
  const caseAuditDetails = caseDetailsAndAuditDetails.auditDetails;
  const modifiedCaseDetailsAndAuditDetails = addFieldsToCaseDetails(
    caseDetails.toJSON(),
    caseAuditDetails
  );

  return {
    caseDetails: modifiedCaseDetailsAndAuditDetails.caseDetails,
    auditDetails: modifiedCaseDetailsAndAuditDetails.auditDetails
  };
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
  return addFieldsToCaseDetails(caseData.toJSON()).caseDetails;
};

const getCaseDetailsAndAuditDetails = async (
  caseId,
  transaction,
  permissions
) => {
  let queryOptions = {
    paranoid: false,
    include: [
      {
        model: models.case_classification,
        as: "caseClassifications"
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
        model: models.district,
        as: "caseDistrict"
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
          { model: models.race_ethnicity, as: "raceEthnicity" },
          { model: models.gender_identity, as: "genderIdentity" }
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
        { model: models.case_classification, as: "caseClassifications" },
        "createdAt",
        ASCENDING
      ],
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

  const caseDetails = await models.cases.findByPk(caseId, queryOptions);

  if (!permissions.includes(USER_PERMISSIONS.VIEW_ANONYMOUS_DATA)) {
    caseDetails.dataValues.complainantCivilians.forEach(civilian => {
      civilian.anonymizeCivilian();
      anonymizeAddress(civilian);
      anonymizeRace(civilian);
      anonymizeGender(civilian);
      civilian.civilianTitleId = null;
    });

    caseDetails.dataValues.witnessCivilians.forEach(civilian => {
      civilian.anonymizeCivilian();
      anonymizeAddress(civilian);
      anonymizeRace(civilian);
      anonymizeGender(civilian);
      civilian.civilianTitleId = null;
    });

    caseDetails.dataValues.complainantOfficers.forEach(officer =>
      officer.anonymizeOfficer()
    );

    caseDetails.dataValues.witnessOfficers.forEach(officer =>
      officer.anonymizeOfficer()
    );
  }

  const caseAuditDetails = getQueryAuditAccessDetails(
    queryOptions,
    models.cases.name
  );

  return { caseDetails: caseDetails, auditDetails: caseAuditDetails };
};

export const addFieldsToCaseDetails = (caseDetails, auditDetails = null) => {
  const newCaseDetailsAndAuditDetails = addPdfIsAvailable(
    caseDetails,
    auditDetails
  );
  const newCaseDetails = newCaseDetailsAndAuditDetails.caseDetails;
  const newAuditDetails = newCaseDetailsAndAuditDetails.auditDetails;
  return addIsArchived(newCaseDetails, newAuditDetails);
};

const addIsArchived = (caseDetails, auditDetails = null) => {
  caseDetails.isArchived = caseDetails.deletedAt !== null;
  delete caseDetails.deletedAt;

  let modifiedAuditDetails = null;
  if (auditDetails) {
    auditDetails.cases.attributes.push("isArchived");
    modifiedAuditDetails = removeFromExistingAuditDetails(auditDetails, {
      cases: ["deletedAt"]
    });
  }
  return { caseDetails: caseDetails, auditDetails: modifiedAuditDetails };
};

const addPdfIsAvailable = (caseDetails, auditDetails = null) => {
  caseDetails.pdfAvailable = pdfIsAvailable(caseDetails.referralLetter);
  delete caseDetails.referralLetter;

  if (auditDetails) {
    auditDetails.cases.attributes.push("pdfAvailable");
    delete auditDetails.referralLetter;
  }

  return { caseDetails: caseDetails, auditDetails: auditDetails };
};

const pdfIsAvailable = referralLetter => {
  if (!referralLetter) {
    return false;
  }
  return referralLetter.finalPdfFilename !== null;
};

const anonymizeAddress = civilian => {
  if (civilian.isAnonymous && civilian.address) {
    civilian.address.streetAddress = "";
    civilian.address.streetAddress2 = "";
    civilian.address.city = "";
    civilian.address.state = "";
    civilian.address.zipCode = "";
    civilian.address.country = "";
    civilian.address.lat = null;
    civilian.address.lng = null;
    civilian.address.additionalLocationInfo = "";
    civilian.address.placeId = null;
  }
};

const anonymizeRace = civilian => {
  if (civilian.isAnonymous && civilian.raceEthnicity) {
    civilian.raceEthnicity.name = "";
    civilian.raceEthnicityId = null;
  }
};

const anonymizeGender = civilian => {
  if (civilian.isAnonymous && civilian.genderIdentity) {
    civilian.genderIdentity.name = "";
    civilian.genderIdentityId = null;
  }
};
