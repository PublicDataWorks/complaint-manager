const { DATA_DELETED } = require("../../sharedUtilities/constants");
const { DATA_CREATED } = require("../../sharedUtilities/constants");
const { DATA_UPDATED } = require("../../sharedUtilities/constants");
const _ = require("lodash");
const Boom = require("boom");

exports.init = sequelize => {
  const originalCreate = sequelize.Model.create;
  const originalUpdate = sequelize.Model.update;
  const originalInstanceUpdate = sequelize.Model.prototype.update;
  const originalDestroy = sequelize.Model.destroy;
  const originalInstanceDestroy = sequelize.Model.prototype.destroy;

  const fieldsToIgnore = ["createdAt", "updatedAt", "createdBy", "deletedAt"];

  sequelize.Model.prototype.update = async function(values, options) {
    return await addTransactionToFunction(
      originalInstanceUpdate,
      values,
      options,
      this
    );
  };

  sequelize.Model.prototype.destroy = async function(options) {
    return await addTransactionToDestroy(
      originalInstanceDestroy,
      options,
      this
    );
  };

  _.extend(sequelize.Model, {
    auditDataChange: function() {
      this.addHook("afterCreate", afterCreateHook);
      this.addHook("afterUpdate", afterUpdateHook);
      this.addHook("afterDestroy", afterDestroyHook);
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
    },
    destroy: async function(options = {}) {
      options.individualHooks = true;
      return await addTransactionToDestroy(originalDestroy, options, this);
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

  const addTransactionToDestroy = async function(
    originalFunction,
    options,
    thisReference
  ) {
    if (options.transaction) {
      return await originalFunction.bind(thisReference)(options);
    }

    return await sequelize.transaction(async t => {
      options.transaction = t;
      return await originalFunction.bind(thisReference)(options);
    });
  };

  const afterCreateHook = async (instance, options) => {
    await createDataChangeAudit(instance, options, DATA_CREATED);
  };

  const afterUpdateHook = async (instance, options) => {
    if (options.returning) {
      throw Boom.badImplementation('Invalid option: "returning:true"');
    }
    await createDataChangeAudit(instance, options, DATA_UPDATED);
  };

  const afterDestroyHook = async (instance, options) => {
    await createDataChangeAudit(instance, options, DATA_DELETED);
  };
  const raiseAuditException = (instance, options) => {
    throw Boom.notImplemented(`Audit is not implemented for this function.`);
  };

  const getCaseId = async (modelName, instance, options) => {
    switch (modelName) {
      case "case":
        return instance.id;
      case "address":
        if (instance.addressableType === "cases") {
          return instance.addressableId;
        }
        const civilian = await sequelize
          .model("civilian")
          .findById(instance.addressableId, {
            transaction: options.transaction
          });
        return civilian.caseId;
      default:
        return instance.caseId;
    }
  };

  const getModelDescription = async (instance, options) => {
    const modelDescription = await instance.modelDescription(instance, options);
    if (modelDescription !== null && modelDescription !== undefined) {
      return modelDescription;
    }

    throw Boom.badImplementation("Model must supply model description");
  };

  const createDataChangeAudit = async (instance, options, action) => {
    const changes = objectChanges(action, instance);
    const modelName = instance._modelOptions.name.singular;
    const caseId = await getCaseId(modelName, instance, options);
    if (_.isEmpty(changes)) return;
    await sequelize.model("data_change_audit").create(
      {
        user: getUserNickname(options, action, modelName),
        action: action,
        modelName: instance._modelOptions.name.singular,
        modelId: instance.id,
        modelDescription: await getModelDescription(instance, options),
        caseId: caseId,
        snapshot: instance.dataValues,
        changes: changes
      },
      {
        transaction: options.transaction
      }
    );
  };

  const getUserNickname = (options, action, modelName) => {
    const userNickname = options.auditUser;
    if (!userNickname)
      throw Boom.badImplementation(
        `User nickname must be given to db query for auditing. (${modelName} ${action})`
      );
    return userNickname;
  };

  const objectChanges = (action, instance) => {
    if (action === DATA_DELETED) return deleteObjectChanges(instance);
    return createOrUpdateObjectChanges(instance);
  };

  const createOrUpdateObjectChanges = instance => {
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

  const deleteObjectChanges = instance => {
    const fieldsChanging = Object.keys(instance.dataValues).filter(
      key => !fieldsToIgnore.includes(key)
    );

    const objectChanges = {};
    _.forEach(fieldsChanging, field => {
      objectChanges[field] = {
        previous: instance[field]
      };
    });
    return objectChanges;
  };
};
