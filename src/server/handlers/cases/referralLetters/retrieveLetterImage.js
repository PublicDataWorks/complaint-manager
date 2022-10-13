import createConfiguredS3Instance from "../../../createConfiguredS3Instance";
const config = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/serverConfig`);

export const retrieveLetterImage = async (fileName, style) => {
  const s3 = createConfiguredS3Instance();
  if (fileName) {
    const data = await new Promise((resolve, reject) => {
      s3.getObject(
        {
          Bucket: config[process.env.NODE_ENV].s3Bucket,
          Key: `letter-images/${fileName}`
        },
        (err, response) => {
          if (err) {
            console.error(err);
            reject(err);
          } else {
            resolve(response);
          }
        }
      );
    });

    return `<img style="${style || ""}" src="data:${
      data.ContentType
    };base64,${data.Body.toString("base64")}" />`;
  } else {
    return "<p><br></p>";
  }
};
