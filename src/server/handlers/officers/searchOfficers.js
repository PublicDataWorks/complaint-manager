const models = require('../../models/index');

const searchOfficers = async (request, response) => {
    const whereClause = {};
    if (request.query.firstName) {whereClause.first_name = {$iLike: `${request.query.firstName}%`}}
    if (request.query.lastName) {whereClause.last_name = {$iLike: `${request.query.lastName}%`}}
    if (request.query.district) {whereClause.district = {$eq: `${request.query.district}`}}

    try {
        const officers = await models.officer.findAll({
            where: whereClause,
            order: [['last_name', 'ASC'], ['first_name', 'ASC']]
        });
        response.send(officers);
    } catch(error) {
        next(error);
    }
};

module.exports = searchOfficers;