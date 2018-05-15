const _ = require('lodash');
const { DATA_UPDATED } = require('../../sharedUtilities/constants');

exports.init = (sequelize) => {
    _.extend(sequelize.Model, {
        auditDataChange: () => {
            sequelize.addHook('afterUpdate', afterUpdateHook);
        }
    });

    const afterUpdateHook = async (instance, options) => {
        try {
            await sequelize.model('data_change_audit').create({
                user: 'XXXX',  //get this from context
                action: DATA_UPDATED,
                modelName: instance._modelOptions.name.singular,
                modelId: instance.id,
                caseId: instance.id,
                snapshot: {},
                changes: objectChanges(instance)
            });
        } catch (error) {
            console.log("ERROR IN AFTER UPDATE HOOK: ", error)
        }
    };

    const objectChanges = (instance) => {
        const fieldsToIgnore = ['createdAt', 'updatedAt', 'createdBy'];
        const previousValuesChanging = instance.previous();
        const fieldsChanging = Object.keys(previousValuesChanging).filter(field => !fieldsToIgnore.includes(field));
        const objectChanges = {};
        _.forEach(fieldsChanging, field => {
            objectChanges[field] = {previous: previousValuesChanging[field], new: instance[field]};
        });
        return objectChanges;
    }
};
