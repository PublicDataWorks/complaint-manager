const models = require("../../models");

const getAllegations = async (request, response, next) => {
  const uniqueRules = await models.allegation.findAll({
    raw: true,
    attributes: ["rule"],
    group: ["rule"]
  });
  const uniqueRuleParagraphs = await models.allegation.findAll({
    raw: true,
    attributes: ["rule", "paragraph"],
    group: ["rule", "paragraph"]
  });
  const formattedRuleParagraphs = uniqueRules.map(allegationRule => ({
    rule: allegationRule.rule,
    paragraphs: uniqueRuleParagraphs
      .filter(ruleParagraph => ruleParagraph.rule === allegationRule.rule)
      .map(ruleParagraph => ruleParagraph.paragraph)
  }));

  response.status(200).send(formattedRuleParagraphs);
};

module.exports = getAllegations;
