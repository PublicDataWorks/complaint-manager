const models = require('../models');

const createCase = async (req, res) => {
  const createdCase = await models.cases.create(req.body)
  res.send(createdCase)
};

module.exports = createCase