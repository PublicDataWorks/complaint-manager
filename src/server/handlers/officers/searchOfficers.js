const models = require('../../models/index');

const searchOfficers = async (request, response) => {
    const whereClause = {};
    if (request.query.firstName) {whereClause.first_name = {$iLike: `${request.query.firstName}%`}}
    if (request.query.lastName) {whereClause.last_name = {$iLike: `${request.query.lastName}%`}}
    if (request.query.district) {whereClause.district = {$iLike: `${request.query.district}%`}}

    const officers = await models.officer.findAll({
        where: whereClause
    });
    response.send(officers);
};

module.exports = searchOfficers;