import Boom from "boom";
import asyncMiddleware from "../asyncMiddleware";
import models from "../../policeDataManager/models";
const config = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/serverConfig`);
import removeSignatureFileFromS3 from "./removeSignatureFileFromS3";

const deleteSigner = asyncMiddleware(async (request, response, next) => {
  const updatedSigners = await models.sequelize.transaction(
    async transaction => {
      const signer = await models.signers.findByPk(request.params.id, {
        transaction
      });

      if (!signer) {
        throw Boom.notFound("The requested resource was not found");
      }

      if (request.body.signatureFile) {
        removeSignatureFileFromS3(signer.signatureFile);
      }

      await signer.destroy({
        auditUser: request.nickname,
        transaction
      });
    }
  );

  response.status(204).send();
});

export default deleteSigner;
