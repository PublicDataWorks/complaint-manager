const models = require('../models');

const invalidName = (input) => {
    return (!input || input.length == 0 || input.length > 25)
}

const createCase = async (req, res) => {
    try {
      if (invalidName(req.body.firstName) || invalidName(req.body.lastName)){
        res.sendStatus(400)
      }
      else {
        //TODO Check response.  If error, handle. If successful, return with 201
        const createdCase = await models.cases.create(req.body)
        res.send(201, createdCase)
      }
    } catch (e) {
      res.send(e)
    }
};

module.exports = createCase