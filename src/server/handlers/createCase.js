const models = require('../models');

const createCase = async (req, res) => {
    try {

      if (req.body.firstName == '' || req.body.lastName == ''){
        res.sendStatus(400)
      }
      else {

        const createdCase = await models.cases.create(req.body)
        res.send(createdCase)
      }
    } catch (e) {
      res.send(e)
    }
};

module.exports = createCase