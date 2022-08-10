import Boom from "boom";
import asyncMiddleware from "../asyncMiddleware";
import models from "../../policeDataManager/models";
import createConfiguredS3Instance from "../../createConfiguredS3Instance";
const config = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/serverConfig`);
import { checkIfSignatureFileExists, formatPhoneWithDashes } from "./utils";

const deleteSigner = asyncMiddleware(async (request, response, next) => {
  const updatedSigners = await models.sequelize.transaction(
    async transaction => {
      const signer = await models.signers.findByPk(
        request.params.id,
        { transaction }
      );

  if (!signer) {
    throw Boom.notFound("The requested resource was not found");
  }

  if (request.body.signatureFile) {
   removeSignatureFileFromS3(signer.signatureFile)
  };
  await signer.destroy(
    {
      auditUser: request.nickname,
      transaction
    }
  );
});

  response.status(200).send(updatedSigners);
  
});

const removeSignatureFileFromS3 = signatureFile => {
  createConfiguredS3Instance().deleteObject(
    {
      Bucket: config[process.env.NODE_ENV].s3Bucket,
      Key: `signatures/${signatureFile}`
    },
    (err, data) => {
      if (err) {
        console.err("Error while removing signature file from s3", err);
      }
    }
  );
};

export default deleteSigner;
