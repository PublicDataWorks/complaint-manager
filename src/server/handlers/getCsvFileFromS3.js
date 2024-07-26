import asyncMiddleware from "./asyncMiddleware";
import createConfiguredS3Instance from "../createConfiguredS3Instance";

const config = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/serverConfig`);
const getCsvFileFromS3 = asyncMiddleware(async (req, res) => {
    if (process.env.NODE_ENV === "development") {
        res.setHeader("Access-Control-Allow-Origin", "https://localhost");
    }
    
    const params = {
        Bucket: config[process.env.NODE_ENV].s3Bucket,
        Key: "rosterTemplate.csv"
    };
    const s3 = createConfiguredS3Instance();
    const promise = s3.getSignedUrl("getObject", params);
    const url = await promise;
    if (process.env.NODE_ENV === "development") {
        const secureUrl = url.replace("http://host.docker.internal", "https://localhost");
        res.send(secureUrl);
    } else {
        res.send(url);
    }
});

export default getCsvFileFromS3;