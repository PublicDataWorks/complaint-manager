const getCaseWithAllAssociations = require("../../getCaseWithAllAssociations");
const asyncMiddleware = require("../../asyncMiddleware");

const getCase = asyncMiddleware(async (req, res) => {
  const singleCase = await getCaseWithAllAssociations(req.params.id);
  res.send(singleCase);
});

module.exports = getCase;
