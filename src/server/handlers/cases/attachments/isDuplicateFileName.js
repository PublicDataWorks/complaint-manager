const models = require("../../../policeDataManager/models");

const isDuplicateFileName = async (caseId, requestedFileName) => {
  let attachmentsWithSimilarName = await models.attachment.count({
    where: {
      caseId: caseId,
      fileName: requestedFileName
    }
  });

  return attachmentsWithSimilarName > 0;
};

module.exports = isDuplicateFileName;
