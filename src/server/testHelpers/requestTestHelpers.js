import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import models from "../policeDataManager/models/index";
import winston from "winston";

const config =
  require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/serverConfig`)[
    process.env.NODE_ENV
  ];

export const suppressWinstonLogs = test => async () => {
  winston.configure({
    transports: [
      new winston.transports.Console({
        json: config.winston.json,
        colorize: true,
        silent: true
      })
    ],
    level: config.winston.logLevel,
    colorize: true
  });

  try {
    await test();
  } catch (err) {
    throw err;
  } finally {
    winston.configure({
      transports: [
        new winston.transports.Console({
          json: config.winston.json,
          colorize: true
        })
      ],
      level: config.winston.logLevel,
      colorize: true
    });
  }
};

export const buildTokenWithPermissions = (permissions, nickname) => {
  const privateKeyPath = path.join(
    __dirname,
    "../config",
    "test",
    "private.pem"
  );
  const cert = fs.readFileSync(privateKeyPath);

  const payload = {
    foo: "bar",
    scope: `${config.authentication.scope}`,
    perms: permissions,
    permissions: Array.isArray(permissions)
      ? [...permissions, "read:users"]
      : [...permissions.split(" "), "read:users"],
    [config.authentication.nicknameKey]: nickname
  };

  const options = {
    audience: config.authentication.audience,
    issuer: config.authentication.issuer,
    algorithm: config.authentication.algorithm,
    allowInsecureKeySizes: true
  };

  return jwt.sign(payload, cert, options);
};

export const expectResponse = async (
  responsePromise,
  statusCode,
  responseBodyContents = null
) => {
  return await responsePromise.then(
    response => {
      expect(response.statusCode).toEqual(statusCode);
      responseBodyContents &&
        expect(response.body).toEqual(responseBodyContents);
      return response;
    },
    error => {
      expect(error.response.statusCode).toEqual(statusCode);
      responseBodyContents &&
        expect(error.response.body).toEqual(responseBodyContents);
      return error;
    }
  );
};

export const cleanupDatabase = async () => {
  const truncationQuery =
    "TRUNCATE referral_letter_officer_recommended_actions CASCADE;" +
    "TRUNCATE referral_letter_officer_history_notes CASCADE;" +
    "TRUNCATE letter_officers CASCADE;" +
    "TRUNCATE referral_letters CASCADE;" +
    "TRUNCATE recommended_actions CASCADE;" +
    "TRUNCATE addresses CASCADE;" +
    "TRUNCATE cases_officers CASCADE;" +
    "TRUNCATE officers_allegations CASCADE;" +
    "TRUNCATE officers CASCADE;" +
    "TRUNCATE allegations CASCADE;" +
    "TRUNCATE classifications CASCADE;" +
    "TRUNCATE civilians CASCADE;" +
    "TRUNCATE attachments CASCADE;" +
    "TRUNCATE case_notes CASCADE;" +
    "TRUNCATE action_audits CASCADE;" +
    "TRUNCATE legacy_data_change_audits CASCADE;" +
    "TRUNCATE intake_sources CASCADE;" +
    "TRUNCATE how_did_you_hear_about_us_sources CASCADE;" +
    "TRUNCATE race_ethnicities CASCADE;" +
    "TRUNCATE officer_history_options CASCADE;" +
    "TRUNCATE letters CASCADE;" +
    "TRUNCATE cases_inmates CASCADE;" +
    "TRUNCATE inmates CASCADE;" +
    "TRUNCATE cases CASCADE;" +
    "TRUNCATE gender_identities CASCADE;" +
    "TRUNCATE case_note_actions CASCADE;" +
    "TRUNCATE audits CASCADE;" +
    "TRUNCATE case_tags CASCADE;" +
    "TRUNCATE tags CASCADE;" +
    "TRUNCATE civilian_titles CASCADE;" +
    "TRUNCATE districts CASCADE;" +
    "TRUNCATE case_classifications CASCADE;" +
    "TRUNCATE notifications CASCADE;" +
    "TRUNCATE letter_images CASCADE;" +
    "TRUNCATE letter_type_complaint_type CASCADE;" +
    "TRUNCATE letter_types_letter_images CASCADE;" +
    "TRUNCATE letter_types CASCADE;" +
    "TRUNCATE signers CASCADE;" +
    "TRUNCATE configs CASCADE;" +
    "TRUNCATE case_statuses CASCADE;" +
    "TRUNCATE public_data_visualizations CASCADE;" +
    "TRUNCATE feature_toggles CASCADE;" +
    "TRUNCATE complaint_types CASCADE;" +
    "TRUNCATE facilities CASCADE;" +
    "TRUNCATE letter_settings CASCADE;" +
    "TRUNCATE person_types CASCADE;" +
    "TRUNCATE rule_chapters CASCADE;" +
    "TRUNCATE directives CASCADE;" +
    "TRUNCATE priority_levels CASCADE;" +
    "TRUNCATE priority_reasons CASCADE;" +
    "TRUNCATE letter_input_pages CASCADE;" +
    "TRUNCATE housing_units CASCADE;";

  await models.sequelize.query(truncationQuery, {
    type: models.sequelize.QueryTypes.RAW
  });
};
