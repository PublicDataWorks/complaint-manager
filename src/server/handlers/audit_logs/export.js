const TIMEZONE = require("../../../sharedUtilities/constants").TIMEZONE;

const models = require('../../models/index');
const stringify = require('csv-stringify');
const moment = require('moment');

const formatDateForCSV = date => {
    if (!date) {
        return ''
    }
    return moment(date).tz(TIMEZONE).format('MM/DD/YYYY HH:mm:ss z');
}

const exportAuditLog = async (request, response, next) => {
    const dateFormatter = {
        date: formatDateForCSV
    };
    const attributesWithAliases = [['created_at', 'Date'], ['case_id', 'Case #'], ['action', 'Event'], ['user', 'User']];
    const csvOptions = {header: true, formatters: dateFormatter};

    try {
        const audit_logs = await models.sequelize.transaction(async (t) => {
            await models.audit_log.create({
                    action: `System Log Exported`,
                    caseId: null,
                    user: request.nickname
                },
                {
                    transaction: t
                }
            )

            return await models.audit_log.findAll({
                order: [["created_at", "ASC"]],
                attributes: attributesWithAliases,
                raw: true,
                transaction: t
            })
        })

        stringify({audit_logs}['audit_logs'], csvOptions, (err, csvOutput) => {
            response.send(csvOutput);
        });
    } catch (error) {
        next(error)
    }

};

module.exports = exportAuditLog;