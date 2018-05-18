const { DATA_CREATED } = require("../../sharedUtilities/constants");
const _ = require("lodash");
const { DATA_UPDATED } = require("../../sharedUtilities/constants");
const httpContext = require("express-http-context");

exports.init = sequelize => {
  _.extend(sequelize.Model, {
    auditDataChange: function() {
      this.addHook("afterCreate", afterCreateHook);
      this.addHook("afterUpdate", afterUpdateHook);
    }
  });

  const afterCreateHook = async (instance, options) => {
    await createDataChangeAudit(instance, DATA_CREATED);
  };

  const afterUpdateHook = async (instance, options) => {
    await createDataChangeAudit(instance, DATA_UPDATED);
  };

  const createDataChangeAudit = async (instance, action) => {
    try {
      await sequelize.model("data_change_audit").create({
        user: httpContext.get("userNickname") || "bob", //fix
        action: action,
        modelName: instance._modelOptions.name.singular,
        modelId: instance.id,
        caseId: instance.id,
        snapshot: {},
        changes: objectChanges(instance)
      });
    } catch (error) {
      console.log(`ERROR IN AFTER ${action} HOOK: `, error);
      throw error;
    }
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
