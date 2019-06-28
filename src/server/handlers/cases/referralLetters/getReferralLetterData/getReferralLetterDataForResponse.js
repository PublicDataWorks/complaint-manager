import models from "../../../../models";
import shortid from "shortid";
import { ACCUSED, ASCENDING } from "../../../../../sharedUtilities/constants";
import getQueryAuditAccessDetails, {
  removeFromExistingAuditDetails
} from "../../../audits/getQueryAuditAccessDetails";

const getReferralLetterDataForResponse = async (caseId, transaction) => {
  let letterDataAndAuditDetails = await getLetterDataAndAuditDetails(
    caseId,
    transaction
  );

  let letterData = letterDataAndAuditDetails.letterData;
  letterData = letterData.toJSON();
  const letterDataAuditDetails = letterDataAndAuditDetails.auditDetails;

  const transformedLetterOfficerDataAndAuditDetails = transformLetterOfficerDataAndAuditDetails(
    letterData,
    letterDataAuditDetails
  );
  const auditDetails = transformedLetterOfficerDataAndAuditDetails.auditDetails;
  const transformedLetterOfficerData =
    transformedLetterOfficerDataAndAuditDetails.letterOfficerData;

  return {
    referralLetterData: {
      id: letterData.id,
      caseId: letterData.caseId,
      includeRetaliationConcerns: letterData.includeRetaliationConcerns,
      letterOfficers: transformedLetterOfficerData,
      referralLetterIaproCorrections: getIAProCorrections(letterData)
    },
    auditDetails: auditDetails
  };
};

const getIAProCorrections = letterData => {
  return letterData.referralLetterIaproCorrections.length === 0
    ? buildEmptyIAProCorrections()
    : letterData.referralLetterIaproCorrections;
};

const letterOfficerAttributes = caseOfficer => {
  const letterOfficerAttributes = caseOfficer.letterOfficer || {};
  if (
    !letterOfficerAttributes.referralLetterOfficerHistoryNotes ||
    letterOfficerAttributes.referralLetterOfficerHistoryNotes.length === 0
  ) {
    letterOfficerAttributes.referralLetterOfficerHistoryNotes = buildEmptyNotes();
  }
  letterOfficerAttributes.referralLetterOfficerRecommendedActions = buildRecommendedActions(
    letterOfficerAttributes.referralLetterOfficerRecommendedActions
  );
  if (letterOfficerAttributes.officerHistoryOptionId) {
    letterOfficerAttributes.officerHistoryOptionId = letterOfficerAttributes.officerHistoryOptionId.toString();
  }

  return letterOfficerAttributes;
};

const transformLetterOfficerDataAndAuditDetails = (
  letterData,
  auditDetails
) => {
  let modifiedAuditDetails = null;
  if (auditDetails) {
    modifiedAuditDetails = removeFromExistingAuditDetails(auditDetails, {
      caseOfficers: "officerId"
    });
  }

  const letterOfficerData = letterData.caseOfficers.map(caseOfficer => {
    return {
      caseOfficerId: caseOfficer.id,
      fullName: caseOfficer.fullName,
      ...letterOfficerAttributes(caseOfficer)
    };
  });

  return {
    letterOfficerData: letterOfficerData,
    auditDetails: modifiedAuditDetails
  };
};

const buildRecommendedActions = recommendedActions => {
  if (!recommendedActions) {
    return [];
  }
  return recommendedActions.map(action => action.recommendedActionId);
};

const emptyObject = () => ({ tempId: shortid.generate() });

const buildEmptyNotes = () => {
  return [emptyObject()];
};

const buildEmptyIAProCorrections = () => {
  return [emptyObject(), emptyObject(), emptyObject()];
};

const getLetterDataAndAuditDetails = async (caseId, transaction) => {
  const queryOptions = {
    where: { caseId: caseId },
    attributes: ["id", "caseId", "includeRetaliationConcerns"],
    order: [
      [
        { model: models.case_officer, as: "caseOfficers" },
        "created_at",
        ASCENDING
      ],
      [
        {
          model: models.referral_letter_iapro_correction,
          as: "referralLetterIaproCorrections"
        },
        "created_at",
        ASCENDING
      ]
    ],
    include: [
      {
        model: models.referral_letter_iapro_correction,
        as: "referralLetterIaproCorrections",
        attributes: ["id", "details"]
      },
      {
        model: models.case_officer,
        as: "caseOfficers",
        where: { roleOnCase: ACCUSED },
        attributes: [
          "id", //must include officerId or will be named unknown officer
          "officerId",
          "firstName",
          "middleName",
          "lastName",
          "fullName"
        ],
        required: false,
        include: [
          {
            model: models.letter_officer,
            as: "letterOfficer",
            attributes: [
              "id",
              "caseOfficerId",
              "historicalBehaviorNotes",
              "numHistoricalHighAllegations",
              "numHistoricalMedAllegations",
              "numHistoricalLowAllegations",
              "recommendedActionNotes",
              "officerHistoryOptionId"
            ],
            include: [
              {
                model: models.referral_letter_officer_recommended_action,
                as: "referralLetterOfficerRecommendedActions",
                attributes: ["recommendedActionId", "referralLetterOfficerId"],
                separate: true
              },
              {
                model: models.referral_letter_officer_history_note,
                as: "referralLetterOfficerHistoryNotes",
                attributes: [
                  "id",
                  "referralLetterOfficerId",
                  "pibCaseNumber",
                  "details"
                ],
                separate: true
              }
            ]
          }
        ]
      }
    ],
    transaction
  };
  const letterData = await models.referral_letter.findOne(queryOptions);

  const referralLetterAuditDetails = getQueryAuditAccessDetails(
    queryOptions,
    models.referral_letter.name
  );

  return { letterData: letterData, auditDetails: referralLetterAuditDetails };
};

export default getReferralLetterDataForResponse;
