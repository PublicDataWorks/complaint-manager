import models from "../../../policeDataManager/models";
import generatePdfBuffer from "./sharedLetterUtilities/generatePdfBuffer";
import Handlebars from "handlebars";
import getQueryAuditAccessDetails, {
  combineAuditDetails
} from "../../audits/getQueryAuditAccessDetails";
import { retrieveLetterImage } from "./retrieveLetterImage";
import { ASCENDING } from "../../../../sharedUtilities/constants";
require("../../../handlebarHelpers");

const MODEL_MAPPING = {
  complainantOfficers: { model: models.case_officer },
  complainantCivilians: { model: models.civilian },
  witnessCivilians: { model: models.civilian },
  witnessOfficers: { model: models.case_officer },
  referralLetter: { model: models.referral_letter },
  caseClassifications: { model: models.case_classification },
  classification: { model: models.classification },
  incidentLocation: { model: models.address },
  accusedOfficers: { model: models.case_officer, separate: true },
  allegations: { model: models.officer_allegation },
  allegation: { model: models.allegation },
  letterOfficer: { model: models.letter_officer },
  referralLetterOfficerHistoryNotes: {
    model: models.referral_letter_officer_history_note,
    separate: true
  },
  referralLetterOfficerRecommendedActions: {
    model: models.referral_letter_officer_recommended_action,
    separate: true
  },
  recommendedAction: { model: models.recommended_action },
  address: { model: models.address },
  raceEthnicity: { model: models.race_ethnicity },
  genderIdentity: { model: models.gender_identity }
};

const generateLetterPdfBuffer = async (
  caseId,
  includeSignature,
  transaction,
  letterSettings,
  extraData = {}
) => {
  let letterBody, auditDetails;

  const letterType = await models.letter_types.findOne({
    where: { type: letterSettings.type },
    include: ["fields"]
  });

  if (letterType.editableTemplate) {
    const queryOptions = {
      where: { caseId },
      attributes: ["editedLetterHtml"],
      transaction
    };
    let letterData = await models.referral_letter.findOne(queryOptions);
    letterBody = letterData.editedLetterHtml;

    ({ html: letterBody, auditDetails } = await determineLetterBody(
      letterBody,
      () =>
        getQueryAuditAccessDetails(queryOptions, models.referral_letter.name),
      letterType,
      caseId,
      transaction
    ));
  }

  const pdfDataAndAuditDetails = await getLetterData(
    caseId,
    letterType.fields.filter(field => !field.isForBody)
  );
  const pdfData = { ...pdfDataAndAuditDetails.data, ...extraData };
  const pdfDataAuditDetails = pdfDataAndAuditDetails.auditDetails;

  const fullLetterHtml = await generateLetterPdfHtml(
    letterBody,
    pdfData,
    includeSignature,
    letterSettings,
    letterType.template
  );

  auditDetails = auditDetails
    ? combineAuditDetails(auditDetails, pdfDataAuditDetails)
    : pdfDataAuditDetails;

  return {
    pdfBuffer: await generatePdfBuffer(fullLetterHtml),
    auditDetails: auditDetails
  };
};

export const generateLetterPdfHtml = async (
  letterBody,
  pdfData,
  includeSignature,
  letterSettings,
  template
) => {
  const currentDate = Date.now();

  let sender = pdfData.sender || pdfData.referralLetter?.sender;
  let signature = includeSignature
    ? await letterSettings.getSignature({ sender })
    : "<p><br></p>";
  let header = await retrieveLetterImage("header_text.png", "max-width: 223px");
  let smallIcon = await retrieveLetterImage("icon.ico", "max-width: 30px");
  let largeIcon = await retrieveLetterImage("icon.ico", "max-width: 42px");

  const letterPdfData = {
    ...pdfData,
    letterBody,
    signature,
    currentDate,
    header,
    smallIcon,
    largeIcon
  };

  const compiledTemplate = Handlebars.compile(template);
  return compiledTemplate(letterPdfData);
};

export const determineLetterBody = async (
  letterBody,
  auditIfEdited,
  letterType,
  caseId,
  transaction
) => {
  let auditDetails, html;
  if (letterBody) {
    html = letterBody;
    auditDetails = auditIfEdited();
  } else {
    const letterDataResults = await getLetterData(
      caseId,
      letterType.fields.filter(field => field.isForBody)
    );
    const compiledTemplate = Handlebars.compile(letterType.editableTemplate);
    html = compiledTemplate(letterDataResults.data);
    auditDetails = letterDataResults.auditDetails;
  }

  return { html, auditDetails };
};

export const getLetterData = async (caseId, fields) => {
  let queryOptions = {
    attributes: constructLetterDataQueryAttributes(fields),
    order: constructLetterDataQueryOrder(fields),
    include: constructLetterDataQueryInclude(fields)
  };

  let letterData = await models.cases.findByPk(caseId, queryOptions);

  letterData = letterData.toJSON();
  if (letterData?.accusedOfficers) {
    letterData.accusedOfficers = letterData.accusedOfficers.sort(
      (officerA, officerB) => {
        return officerA.createdAt - officerB.createdAt;
      }
    );
  }

  return {
    data: letterData,
    auditDetails: getQueryAuditAccessDetails(queryOptions, models.cases.name)
  };
};

const constructLetterDataQueryInclude = fields => {
  return fields
    .filter(field => field.relation !== "cases")
    .reduce(
      (include, f) =>
        addRelationToIncludeClause(f.relation.split("."), include, f.field),
      []
    );
};

const constructLetterDataQueryOrder = fields => {
  return fields
    .filter(field => !!field.sortBy)
    .map(field => {
      let relationName = field.relation.split(".").pop();
      return [
        { model: MODEL_MAPPING[relationName].model, as: relationName },
        field.sortBy,
        field.sortDirection || ASCENDING
      ];
    });
};

const constructLetterDataQueryAttributes = fields => {
  return fields.filter(field => field.relation === "cases").map(f => f.field);
};

/**
 * addRelationToIncludeClause - recursive function that creates sequelize "include" objects
 * and adds them to a given array (to be used in a sequelize query)
 *
 * @param {Array} pathToRelation an array of strings that shows the nesting needed
 * to place the field at the right depth
 * @param {Array} placeToAddRelation the include array that has been constructed so far (expect to pass a reference to an empty array on the initial call)
 * @param {String} field the name of the attribute to be included (if * then all fields should be included)
 * @returns the array (originally placeToAddRelation) that contains the constructed include clause(s)
 */
const addRelationToIncludeClause = (
  pathToRelation,
  placeToAddRelation,
  field
) => {
  let relationName = pathToRelation.shift();

  let existingObject = placeToAddRelation.find(obj => obj.as === relationName);
  if (!existingObject) {
    existingObject = createIncludeObject(relationName, placeToAddRelation);
  }

  if (pathToRelation.length) {
    existingObject.include = existingObject.include || [];
    addRelationToIncludeClause(pathToRelation, existingObject.include, field);
  } else {
    // base case
    if (field !== "*") {
      existingObject.attributes = existingObject.attributes
        ? existingObject.attributes
        : [];
      existingObject.attributes.push(field);
    }
  }

  return placeToAddRelation;
};

const createIncludeObject = (relationName, placeToAddRelation) => {
  let existingObject = {
    model: MODEL_MAPPING[relationName].model
  };

  if (relationName !== "address" && relationName !== "allegation") {
    existingObject.as = relationName;
  }

  if (MODEL_MAPPING[relationName].separate) {
    existingObject.separate = true;
  }

  placeToAddRelation.push(existingObject);
  return existingObject;
};

export default generateLetterPdfBuffer;
