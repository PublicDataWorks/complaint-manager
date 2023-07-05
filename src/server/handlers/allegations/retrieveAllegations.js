import { ASCENDING } from "../../../sharedUtilities/constants";

const models = require("../../policeDataManager/models");

const retrieveAllegations = async (request, response, next) => {
  const uniqueRules = await models.allegation.findAll({
    raw: true,
    attributes: ["rule"],
    order: [["rule", ASCENDING]],
    group: ["rule"],
    where: { deletedAt: null }
  });
  const uniqueRuleParagraphs = await models.allegation.findAll({
    raw: true,
    attributes: ["rule", "paragraph"],
    order: [
      ["rule", ASCENDING],
      ["paragraph", ASCENDING]
    ],
    group: ["rule", "paragraph"],
    where: { deletedAt: null }
  });
  const formattedRuleParagraphs = uniqueRules.map(allegationRule => ({
    rule: allegationRule.rule,
    paragraphs: uniqueRuleParagraphs
      .filter(ruleParagraph => ruleParagraph.rule === allegationRule.rule)
      .map(ruleParagraph => ruleParagraph.paragraph)
  }));

  response.status(200).send(formattedRuleParagraphs);
};

module.exports = retrieveAllegations;
