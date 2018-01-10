const models = require('../models')

const healthCheck = (req, res) => {
    models.cases.sequelize
        .authenticate()
        .then(() => {
            res.status(200).send({message: "Success"});
        })
        .catch(err => {
            //TODO Log the error with severity and pipe to SumoLogic
            res.status(500).send({message: "Failed to connect"});
        });
}

module.exports = healthCheck