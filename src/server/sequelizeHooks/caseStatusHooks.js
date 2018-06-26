const _ = require("lodash");

exports.init = sequelize => {
  _.extend(sequelize.Model, {
    updateCaseStatusAfterCreate: function() {
      this.addHook("afterCreate", updateCaseStatusHook);
    },
    updateCaseStatusAfterUpdate: function() {
      this.addHook("afterUpdate", updateCaseStatusHook);
    },
    updateCaseStatusAfterDestroy: function() {
      this.addHook("afterDestroy", updateCaseStatusHook);
    }
  });

  const updateCaseStatusHook = async function(instance, options) {
    const caseId = await instance.getCaseId(options.transaction);
    if (!caseId)
      throw Boom.notImplemented(
        "Model must implement getCaseId to update case status"
      );
    await sequelize.models["cases"].update(
      {},
      { where: { id: caseId }, auditUser: options.auditUser }
    );
  };
};
