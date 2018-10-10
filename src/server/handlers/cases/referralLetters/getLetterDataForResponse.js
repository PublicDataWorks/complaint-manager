import models from "../../../models/index";
import shortid from "shortid";

const getLetterDataForResponse = async caseId => {
  let letterData = await getLetterData(caseId);
  letterData = letterData.toJSON();

  const transformedLetterOfficerData = letterData.caseOfficers.map(
    caseOfficer => {
      return {
        caseOfficerId: caseOfficer.id,
        fullName: caseOfficer.fullName,
        ...letterOfficerAttributesWithNotes(caseOfficer)
      };
    }
  );
  const transformedLetterData = {
    id: letterData.id,
    caseId: letterData.caseId,
    referralLetterOfficers: transformedLetterOfficerData,
    referralLetterIAProCorrections: getIAProCorrections(letterData)
  };

  return transformedLetterData;
};

const getIAProCorrections = letterData => {
  return letterData.referralLetterIAProCorrections.length === 0
    ? buildEmptyIAProCorrections()
    : letterData.referralLetterIAProCorrections;
};

const letterOfficerAttributesWithNotes = caseOfficer => {
  const letterOfficerAttributes = caseOfficer.referralLetterOfficer || {};
  if (
    !letterOfficerAttributes.referralLetterOfficerHistoryNotes ||
    letterOfficerAttributes.referralLetterOfficerHistoryNotes.length === 0
  ) {
    letterOfficerAttributes.referralLetterOfficerHistoryNotes = buildEmptyNotes();
  }
  return letterOfficerAttributes;
};

const emptyObject = { tempId: shortid.generate() };

const buildEmptyNotes = () => {
  return [emptyObject];
};

const buildEmptyIAProCorrections = () => {
  return [emptyObject, emptyObject, emptyObject];
};

const getLetterData = async caseId => {
  return await models.referral_letter.findOne({
    where: { caseId: caseId },
    attributes: ["id", "caseId"],
    order: [
      [{ model: models.case_officer, as: "caseOfficers" }, "created_at", "ASC"],
      [
        {
          model: models.referral_letter_iapro_correction,
          as: "referralLetterIAProCorrections"
        },
        "created_at",
        "ASC"
      ]
    ],
    include: [
      {
        model: models.referral_letter_iapro_correction,
        as: "referralLetterIAProCorrections",
        attributes: ["id", "details"]
      },
      {
        model: models.case_officer,
        as: "caseOfficers",
        attributes: ["id", "officerId", "firstName", "middleName", "lastName"], //must include officerId or will be named unknown officer
        include: [
          {
            model: models.referral_letter_officer,
            as: "referralLetterOfficer",
            attributes: [
              "id",
              "caseOfficerId",
              "historicalBehaviorNotes",
              "numHistoricalHighAllegations",
              "numHistoricalMedAllegations",
              "numHistoricalLowAllegations"
            ],
            include: [
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
    ]
  });
};

export default getLetterDataForResponse;
