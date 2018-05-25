const models = require("../models");
const Boom = require("boom");

const healthCheck = async (req, res, next) => {
  models.cases.sequelize
    .authenticate()
    .then(() => {
      res.status(200).send({ message: "Success" });
    })
    .catch(err => {
      next(Boom.badImplementation(err));
    });
};

module.exports = healthCheck;
