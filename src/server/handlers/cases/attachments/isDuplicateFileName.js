const models = require("../../../complaintManager/models");

const isDuplicateFileName = async (caseId, requestedFileName) => {
  const attachmentsWithSimilarName = await models.attachment.count({
    where: {
      caseId: caseId,
      fileName: requestedFileName
    }
  });

  return attachmentsWithSimilarName > 0;
};

module.exports = isDuplicateFileName;
