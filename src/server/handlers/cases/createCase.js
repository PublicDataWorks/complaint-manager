const models = require("../../models/index");

const invalidName = input => {
  return !input || input.length === 0 || input.length > 25;
};

const createCase = async (req, res, next) => {
  try {
    if (
      invalidName(req.body.civilian.firstName) ||
      invalidName(req.body.civilian.lastName)
    ) {
      res.sendStatus(400);
    } else {
      const createdCase = await models.cases.create(
        {
          ...req.body.case,
          civilians: [req.body.civilian]
        },
        {
          include: [
            {
              model: models.civilian
            }
          ],
          auditUser: req.nickname
        }
      );

      res.status(201).send(createdCase);
    }
  } catch (e) {
    next(e);
  }
};

module.exports = createCase;
