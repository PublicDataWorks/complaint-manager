import throwErrorIfLetterFlowUnavailable from "../throwErrorIfLetterFlowUnavailable";
import asyncMiddleware from "../../../asyncMiddleware";
import models from "../../../../models/index";

const editClassifications = asyncMiddleware(async (request, response, next) => {
  const caseId = request.params.caseId;
  const updatedClassifications = request.body.classifications;
  await throwErrorIfLetterFlowUnavailable(caseId);

  await models.sequelize.transaction(async transaction => {
    const existingClassifications = await getExistingClassifications(
      caseId,
      transaction
    );
    await removeUnmarkedClassifications(
      caseId,
      existingClassifications,
      updatedClassifications,
      request.nickname,
      transaction
    );
    await createNewClassifications(
      updatedClassifications,
      existingClassifications,
      caseId,
      request.nickname,
      transaction
    );
  });
  return response.status(200).send();
});

const createNewClassifications = async (
  updatedClassifications,
  existingClassifications,
  caseId,
  auditUser,
  transaction
) => {
  for (const classificationId of updatedClassifications) {
    if (
      classificationId &&
      !existingClassifications.includes(classificationId)
    ) {
      await models.case_classification.create(
        {
          caseId: caseId,
          newClassificationId: classificationId
        },
        {
          auditUser: auditUser,
          transaction
        }
      );
    }
  }
};

const getExistingClassifications = async (caseId, transaction) => {
  return await models.case_classification
    .findAll({
      where: { caseId },
      attributes: ["new_classification_id"],
      raw: true,
      transaction
    })
    .map(new_classification => {
      return new_classification.new_classification_id;
    });
};

const removeUnmarkedClassifications = async (
  caseId,
  existingClassifications,
  updatedClassifications,
  auditUser,
  transaction
) => {
  if (existingClassifications.length === 0) {
    return;
  }
  const classificationsToBeDeleted = existingClassifications.filter(
    existingClassification =>
      !updatedClassifications.includes(existingClassification)
  );
  await models.case_classification.destroy({
    where: {
      caseId: caseId,
      newClassificationId: classificationsToBeDeleted
    },
    auditUser: auditUser,
    transaction
  });
};

export default editClassifications;
