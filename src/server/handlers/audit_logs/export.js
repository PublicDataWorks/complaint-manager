const TIMEZONE = require("../../../sharedUtilities/constants").TIMEZONE;

const models = require('../../models/index');
const csv = require('csv');
const moment = require('moment');

const formatDateForCSV = date => {
    if (!date) {
        return ''
    }
    return moment(date).tz(TIMEZONE).format('MM/DD/YYYY HH:mm CT');
}

const exportAuditLog = async (request, response, next) => {
    const dateFormatter = {
        date: formatDateForCSV
    };
    const attributesWithAliases = [['created_at', 'Date'], ['case_id', 'Case #'], ['action', 'Event'], ['user', 'User']];
    const csvOptions = {header: true, formatters: dateFormatter};

    try {
        const audit_logs = await models.audit_log.findAll({attributes: attributesWithAliases, raw: true})
        csv.stringify({audit_logs}['audit_logs'], csvOptions, (err, csvOutput) => {
            response.send(csvOutput);
        });
    } catch(error) {
        next(error)
    }

};

module.exports = exportAuditLog;