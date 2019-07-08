import models from "../../../models";
import _ from "lodash";
import moment from "moment-timezone";
import sequelize from "sequelize";
import { endOfLegacyAuditTimestamps } from "./auditTransformHelpers";
import {
  AUDIT_ACTION,
  AUDIT_TYPE
} from "../../../../sharedUtilities/constants";
import { legacyFormatAuditDetails } from "../../../handlers/audits/legacyFormatAuditDetails";

export const transformOldDataAccessAuditsToNew = async transaction => {
  const Op = sequelize.Op;

  const audits = await models.action_audit.findAll({
    where: {
      action: AUDIT_ACTION.DATA_ACCESSED,
      createdAt: {
        [Op.gt]: endOfLegacyAuditTimestamps[process.env.NODE_ENV]
      }
    }
  });

  for (let i = 0; i < audits.length; i++) {
    await transformSingleOldAuditToNew(audits[i], transaction);
  }
};

export const transformSingleOldAuditToNew = async (
  oldAuditData,
  transaction
) => {
  const dataAccessValues = generateDataAccessValues(oldAuditData);

  await models.audit.create(
    {
      caseId: oldAuditData.caseId,
      auditAction: oldAuditData.action,
      user: oldAuditData.user,
      createdAt: oldAuditData.createdAt,
      dataAccessAudit: {
        auditSubject: oldAuditData.subject,
        dataAccessValues: dataAccessValues
      }
    },
    {
      include: [
        {
          model: models.data_access_audit,
          as: "dataAccessAudit",
          include: [{ model: models.data_access_value, as: "dataAccessValues" }]
        }
      ],
      transaction
    }
  );
};

const generateDataAccessValues = audit => {
  const auditDetails = audit.auditDetails;
  return Object.keys(auditDetails).map(auditDetailKey => {
    const auditDetailMapping =
      mapAuditDetailsKeyToAssociationAndModel[auditDetailKey];
    return {
      association: auditDetailMapping.association,
      fields: generateFields(audit, auditDetailKey, auditDetailMapping)
    };
  });
};

const generateFields = (audit, auditDetailKey, auditDetailMapping) => {
  const auditDetails = audit.auditDetails;
  let fieldsArray = [];
  auditDetails[auditDetailKey].forEach(fieldElement => {
    if (fieldElement === `All ${auditDetailKey} Data`) {
      const fieldsToAdd = getFieldsFromModel(
        auditDetailMapping,
        audit.createdAt
      );
      fieldsToAdd.forEach(attribute => {
        fieldsArray.push(attribute);
      });
    } else {
      fieldsArray.push(_.camelCase(fieldElement));
    }
  });

  return fieldsArray;
};

export const getFieldsFromModel = (auditDetailMapping, createdAt) => {
  const fields = Object.keys(
    models[auditDetailMapping.modelName].rawAttributes
  );
  if (
    auditDetailMapping.modelName === models.cases.name &&
    moment(createdAt).isBefore(times.migration20190228[process.env.NODE_ENV])
  ) {
    _.remove(fields, field => {
      return field === "howDidYouHearAboutUsSourceId";
    });
  }
  if (
    auditDetailMapping.modelName === models.civilian.name &&
    moment(createdAt).isBefore(times.migration20190417[process.env.NODE_ENV])
  ) {
    _.remove(fields, field => {
      return field === "genderIdentityId";
    });
    fields.push("genderIdentity");
  }
  if (
    auditDetailMapping.modelName === models.case_note.name &&
    moment(createdAt).isBefore(times.migration20190424[process.env.NODE_ENV])
  ) {
    _.remove(fields, field => {
      return field === "caseNoteActionId";
    });
    fields.push("action");
  }
  return fields;
};

export const transformNewDataAccessAuditsToOld = async transaction => {
  const audits = await models.audit.findAll({
    where: {
      auditAction: AUDIT_ACTION.DATA_ACCESSED
    },
    include: [
      {
        model: models.data_access_audit,
        as: "dataAccessAudit",
        include: [
          {
            model: models.data_access_value,
            as: "dataAccessValues"
          }
        ]
      }
    ]
  });

  for (let auditIndex = 0; auditIndex < audits.length; auditIndex++) {
    const existingActionAudit = await models.action_audit.findOne({
      where: {
        action: audits[auditIndex].auditAction,
        createdAt: audits[auditIndex].createdAt,
        user: audits[auditIndex].user
      }
    });
    if (!existingActionAudit) {
      await transformSingleNewAuditToOld(audits[auditIndex], transaction);
    }
  }
  await models.data_access_audit.destroy({ truncate: true, cascade: true });
  await models.audit.destroy({
    where: {
      auditAction: AUDIT_ACTION.DATA_ACCESSED
    }
  });
};

export const transformSingleNewAuditToOld = async (audit, transaction) => {
  const associationToModelNameMap = getAssociationToModelMapping(
    mapAuditDetailsKeyToAssociationAndModel
  );
  const auditDetails = {};

  audit.dataAccessAudit.dataAccessValues.forEach(dataAccessValue => {
    auditDetails[dataAccessValue.association] = {
      attributes: dataAccessValue.fields,
      model: associationToModelNameMap[dataAccessValue.association]
    };
  });

  const formattedAuditDetails = legacyFormatAuditDetails(auditDetails);

  await models.action_audit.create(
    {
      action: AUDIT_ACTION.DATA_ACCESSED,
      auditType: AUDIT_TYPE.DATA_ACCESS,
      user: audit.user,
      caseId: audit.caseId,
      subject: audit.dataAccessAudit.auditSubject,
      auditDetails: formattedAuditDetails,
      createdAt: audit.createdAt
    },
    { transaction }
  );
};

export const times = {
  migration20190228: {
    test: moment("2019-03-04T11:19:02-06:00"),
    development: moment("2019-03-04T11:19:02-06:00"),
    ci: moment("2019-03-04T11:19:02-06:00"),
    staging: moment("2019-03-04T11:19:02-06:00"),
    production: moment("2019-03-07T16:35:37-05:00")
  },
  migration20190417: {
    test: moment("2019-04-19T10:34:41-05:00"),
    development: moment("2019-04-19T10:34:41-05:00"),
    ci: moment("2019-04-19T10:34:41-05:00"),
    staging: moment("2019-04-25T10:20:01-05:00"),
    production: moment("2019-04-30T10:34:41-05:00")
  },
  migration20190424: {
    test: moment("2019-05-06T09:57:59-05:00"),
    development: moment("2019-05-06T09:57:59-05:00"),
    ci: moment("2019-05-06T09:57:59-05:00"),
    staging: moment("2019-05-19T10:27:43-05:00"),
    production: moment("2019-05-14T17:03:35-05:00")
  }
};

const mapAuditDetailsKeyToAssociationAndModel = {
  Officer: {
    modelName: models.officer.name,
    association: "officer"
  },
  "Referral Letter": {
    modelName: models.referral_letter.name,
    association: "referralLetter"
  },
  Address: {
    modelName: models.address.name,
    association: "address"
  },
  Allegation: {
    modelName: models.allegation.name,
    association: "allegation"
  },
  Attachment: {
    modelName: models.attachment.name,
    association: "attachment"
  },
  "Case Note": {
    modelName: models.case_note.name,
    association: "caseNote"
  },
  "Case Note Action": {
    modelName: models.case_note_action.name,
    association: "caseNoteAction"
  },
  "Case Officer": {
    modelName: models.case_officer.name,
    association: "caseOfficer"
  },
  "Case Officers": {
    modelName: models.case_officer.name,
    association: "caseOfficers"
  },
  Allegations: {
    modelName: models.officer_allegation.name,
    association: "allegations"
  },
  "Letter Officer": {
    modelName: models.letter_officer.name,
    association: "letterOfficer"
  },
  Case: {
    modelName: models.cases.name,
    association: "cases"
  },
  "Complainant Civilians": {
    modelName: models.civilian.name,
    association: "complainantCivilians"
  },
  "Complainant Civilian": {
    modelName: models.civilian.name,
    association: "complainantCivilian"
  },
  "Witness Civilians": {
    modelName: models.civilian.name,
    association: "witnessCivilians"
  },
  "Incident Location": {
    modelName: models.address.name,
    association: "incidentLocation"
  },
  "Accused Officers": {
    modelName: models.case_officer.name,
    association: "accusedOfficers"
  },
  "Complainant Officers": {
    modelName: models.case_officer.name,
    association: "complainantOfficers"
  },
  "Witness Officers": {
    modelName: models.case_officer.name,
    association: "witnessOfficers"
  },
  "How Did You Hear About Us Source": {
    modelName: models.how_did_you_hear_about_us_source.name,
    association: "howDidYouHearAboutUsSource"
  },
  "Intake Source": {
    modelName: models.intake_source.name,
    association: "intakeSource"
  },
  Civilian: {
    modelName: models.civilian.name,
    association: "civilian"
  },
  "Race Ethnicity": {
    modelName: models.race_ethnicity.name,
    association: "raceEthnicity"
  },
  "Gender Identity": {
    modelName: models.gender_identity.name,
    association: "genderIdentity"
  },
  Classification: {
    modelName: models.classification.name,
    association: "classification"
  },
  "Complainant Letter": {
    modelName: models.complainant_letter.name,
    association: "complainantLetter"
  },
  "Referral Letter Officer History Notes": {
    modelName: models.referral_letter_officer_history_note.name,
    association: "referralLetterOfficerHistoryNotes"
  },
  "Referral Letter Officer History Note": {
    modelName: models.referral_letter_officer_history_note.name,
    association: "referralLetterOfficerHistoryNote"
  },
  "Referral Letter Officer Recommended Actions": {
    modelName: models.referral_letter_officer_recommended_action.name,
    association: "referralLetterOfficerRecommendedActions"
  },
  "Referral Letter Officer Recommended Action": {
    modelName: models.referral_letter_officer_recommended_action.name,
    association: "referralLetterOfficerRecommendedAction"
  },
  Supervisor: {
    modelName: models.officer.name,
    association: "supervisor"
  },
  "Officer Allegation": {
    modelName: models.officer_allegation.name,
    association: "officerAllegation"
  },
  "Officer History Option": {
    modelName: models.officer_history_option.name,
    association: "officerHistoryOption"
  },
  "Recommended Action": {
    modelName: models.recommended_action.name,
    association: "recommendedAction"
  },
  "Referral Letter Iapro Corrections": {
    modelName: models.referral_letter_iapro_correction.name,
    association: "referralLetterIaproCorrections"
  },
  "Referral Letter IA Pro Corrections": {
    modelName: models.referral_letter_iapro_correction.name,
    association: "referralLetterIaproCorrections"
  },
  "Referral Letter Iapro Correction": {
    modelName: models.referral_letter_iapro_correction.name,
    association: "referralLetterIaproCorrection"
  },
  "Earliest Added Accused Officer": {
    modelName: models.case_officer.name,
    association: "earliestAddedAccusedOfficer"
  },
  "Earliest Added Complainant": {
    association: "earliestAddedComplainant",
    modelName: null
  },
  "Legacy Data Change Audit": {
    modelName: models.legacy_data_change_audit.name,
    association: "legacyDataChangeAudit"
  },
  "Action Audit": {
    modelName: models.action_audit.name,
    association: "actionAudit"
  }
};

const getAssociationToModelMapping = mapAuditDetailsKeyToAssociationAndModel => {
  const mapAssociationToModel = {};
  Object.keys(mapAuditDetailsKeyToAssociationAndModel).forEach(mappingKey => {
    mapAssociationToModel[
      mapAuditDetailsKeyToAssociationAndModel[mappingKey].association
    ] = mapAuditDetailsKeyToAssociationAndModel[mappingKey].modelName;
  });
  return mapAssociationToModel;
};
