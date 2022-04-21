import createConfiguredS3Instance from "../../../createConfiguredS3Instance";
import { findFirstSender } from "../../../../sharedUtilities/findFirstSender";

export const retrieveSignatureImage = async sender => {
  const s3 = createConfiguredS3Instance();
  let fileName = findFirstSender(sender);
  if (fileName) {
    const data = await new Promise((resolve, reject) => {
      s3.getObject(
        { Bucket: "noipm-local", Key: `signatures/${fileName}` },
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

    console.log(data);
    return `<img style="max-height: 55px" src="data:${
      data.ContentType
    };base64,${data.Body.toString("base64")}" />`;
  } else {
    return "<p><br></p>";
  }
};
