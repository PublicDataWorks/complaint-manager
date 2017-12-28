const models = require('../models');

const createCase = async (req, res
                          // , next
) => {
    // try {
        const createdCase = await models.cases.create(req.body)
        res.send(createdCase)
    // } catch (e) {
    //   next(e)
    // }
};

module.exports = createCase