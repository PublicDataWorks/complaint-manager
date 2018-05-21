const { DATA_CREATED } = require("../../sharedUtilities/constants");
const _ = require("lodash");
const { DATA_UPDATED } = require("../../sharedUtilities/constants");

exports.init = sequelize => {
  _.extend(sequelize.Model, {
    auditDataChange: function() {
      this.addHook("afterCreate", afterCreateHook);
      this.addHook("afterUpdate", afterUpdateHook);
    }
  });

  const afterCreateHook = async (instance, options) => {
    await createDataChangeAudit(instance, options, DATA_CREATED);
  };

  const afterUpdateHook = async (instance, options) => {
    await createDataChangeAudit(instance, options, DATA_UPDATED);
  };

  const createDataChangeAudit = async (instance, options, action) => {
    try {
      await sequelize.model("data_change_audit").create({
        user: getUserNickname(options),
        action: action,
        modelName: instance._modelOptions.name.singular,
        modelId: instance.id,
        caseId: instance.id,
        snapshot: instance.dataValues,
        changes: objectChanges(instance)
      });
    } catch (error) {
      console.error(`ERROR IN AFTER ${action} HOOK: `, error);
      throw error;
    }
  };

  const getUserNickname = options => {
    const userNickname = options.auditUser;
    if (!userNickname)
      throw new Error("User nickname must be given for auditing data changes");
    return userNickname;
  };

  const objectChanges = instance => {
    const fieldsToIgnore = ["createdAt", "updatedAt", "createdBy"];
    const previousValuesChanging = instance.previous();
    const fieldsChanging = Object.keys(previousValuesChanging).filter(
      field => !fieldsToIgnore.includes(field)
    );
    const objectChanges = {};
    _.forEach(fieldsChanging, field => {
      objectChanges[field] = {
        previous: previousValuesChanging[field],
        new: instance[field]
      };
    });
    return objectChanges;
  };
};
