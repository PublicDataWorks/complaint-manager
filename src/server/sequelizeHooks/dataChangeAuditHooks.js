const { DATA_CREATED } = require("../../sharedUtilities/constants");
const _ = require("lodash");
const { DATA_UPDATED } = require("../../sharedUtilities/constants");
const Boom = require("boom");

exports.init = sequelize => {
  const originalCreate = sequelize.Model.create;
  const originalUpdate = sequelize.Model.update;
  const originalInstanceUpdate = sequelize.Model.prototype.update;

  sequelize.Model.prototype.update = async function(values, options) {
    return await addTransactionToFunction(
      originalInstanceUpdate,
      values,
      options,
      this
    );
  };

  _.extend(sequelize.Model, {
    auditDataChange: function() {
      this.addHook("afterCreate", afterCreateHook);
      this.addHook("afterUpdate", afterUpdateHook);
      this.addHook("beforeUpsert", raiseAuditException);
    },
    create: async function(values, options = {}) {
      options.individualHooks = true;
      return await addTransactionToFunction(
        originalCreate,
        values,
        options,
        this
      );
    },
    update: async function(values, options = {}) {
      options.individualHooks = true;
      return await addTransactionToFunction(
        originalUpdate,
        values,
        options,
        this
      );
    }
  });

  const addTransactionToFunction = async function(
    originalFunction,
    values,
    options,
    thisReference
  ) {
    if (options.transaction) {
      return await originalFunction.bind(thisReference)(values, options);
    }

    return await sequelize.transaction(async t => {
      options.transaction = t;
      return await originalFunction.bind(thisReference)(values, options);
    });
  };

  const afterCreateHook = async (instance, options) => {
    await createDataChangeAudit(instance, options, DATA_CREATED);
  };

  const afterUpdateHook = async (instance, options) => {
    await createDataChangeAudit(instance, options, DATA_UPDATED);
  };

  const raiseAuditException = (instance, options) => {
    throw Boom.notImplemented(`Audit is not implemented for this function.`);
  };

  const createDataChangeAudit = async (instance, options, action) => {
    const changes = objectChanges(instance);
    if (_.isEmpty(changes)) return;
    await sequelize.model("data_change_audit").create(
      {
        user: getUserNickname(options),
        action: action,
        modelName: instance._modelOptions.name.singular,
        modelId: instance.id,
        caseId: instance.id,
        snapshot: instance.dataValues,
        changes: changes
      },
      {
        transaction: options.transaction
      }
    );
  };

  const getUserNickname = options => {
    const userNickname = options.auditUser;
    if (!userNickname)
      throw Boom.badImplementation(
        "User nickname must be given to db query for auditing"
      );
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
