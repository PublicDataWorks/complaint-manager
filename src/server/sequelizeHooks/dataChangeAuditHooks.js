const { AUDIT_ACTION } = require("../../sharedUtilities/constants");
const _ = require("lodash");
const Boom = require("boom");

const MODEL_ASSOCIATIONS_TO_LOOKUP = [
  {
    foreignKey: "classificationId",
    modelName: "classification",
    identifyingAttribute: "initialism"
  },
  {
    foreignKey: "recommendedActionId",
    modelName: "recommended_action",
    identifyingAttribute: "description"
  },
  {
    foreignKey: "intakeSourceId",
    modelName: "intake_source",
    identifyingAttribute: "name",
    as: "intakeSource"
  },
  {
    foreignKey: "raceEthnicityId",
    modelName: "race_ethnicity",
    identifyingAttribute: "name"
  },
  {
    foreignKey: "heardAboutSourceId",
    modelName: "heard_about_source",
    identifyingAttribute: "name"
  }
];

exports.init = sequelize => {
  const originalCreate = sequelize.Model.create;
  const originalUpdate = sequelize.Model.update;
  const originalInstanceUpdate = sequelize.Model.prototype.update;
  const originalDestroy = sequelize.Model.destroy;
  const originalInstanceDestroy = sequelize.Model.prototype.destroy;
  const originalRestore = sequelize.Model.restore;
  const originalInstanceRestore = sequelize.Model.prototype.restore;

  const fieldsToIgnore = [
    "createdAt",
    "updatedAt",
    "createdBy",
    "deletedAt",
    "deleted_at"
  ];

  sequelize.Model.prototype.update = async function(values, options = {}) {
    return await addTransactionToFunction(
      originalInstanceUpdate,
      values,
      options,
      this
    );
  };

  sequelize.Model.prototype.destroy = async function(options = {}) {
    return await addTransactionToFunctionWithoutValues(
      originalInstanceDestroy,
      options,
      this
    );
  };

  sequelize.Model.prototype.restore = async function(options = {}) {
    return await addTransactionToFunctionWithoutValues(
      originalInstanceRestore,
      options,
      this
    );
  };

  _.extend(sequelize.Model, {
    auditDataChange: function() {
      this.addHook("afterCreate", afterCreateHook);
      this.addHook("afterUpdate", afterUpdateHook);
      this.addHook("afterDestroy", afterDestroyHook);
      this.addHook("afterRestore", afterRestoreHook);
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
      return await addTransactionToFunctionWithoutValues(
        originalDestroy,
        options,
        this
      );
    },
    restore: async function(options = {}) {
      options.individualHooks = true;
      return await addTransactionToFunctionWithoutValues(
        originalRestore,
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

  const addTransactionToFunctionWithoutValues = async function(
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
    await createDataChangeAudit(instance, options, AUDIT_ACTION.DATA_CREATED);
  };

  const afterUpdateHook = async (instance, options) => {
    if (options.returning) {
      throw Boom.badImplementation('Invalid option: "returning:true"');
    }
    await createDataChangeAudit(instance, options, AUDIT_ACTION.DATA_UPDATED);
  };

  const afterDestroyHook = async (instance, options) => {
    const auditAction =
      instance._modelOptions.name.singular === "case"
        ? AUDIT_ACTION.DATA_ARCHIVED
        : AUDIT_ACTION.DATA_DELETED;
    await createDataChangeAudit(instance, options, auditAction);
  };

  const afterRestoreHook = async (instance, options) => {
    await createDataChangeAudit(instance, options, AUDIT_ACTION.DATA_RESTORED);
  };

  const raiseAuditException = (instance, options) => {
    throw Boom.notImplemented(`Audit is not implemented for this function.`);
  };

  const getModelDescription = async (modelName, instance, transaction) => {
    if (instance.modelDescription) {
      const modelDescription = await instance.modelDescription(transaction);

      if (modelDescription !== null && modelDescription !== undefined) {
        return modelDescription;
      }
    }
    throw Boom.badImplementation(
      `Model must implement modelDescription (${modelName})`
    );
  };

  const getCaseId = async (modelName, instance, transaction) => {
    if (instance.getCaseId) {
      return await instance.getCaseId(transaction);
    }

    throw Boom.badImplementation(
      `Model must implement getCaseId (${modelName})`
    );
  };

  const createDataChangeAudit = async (instance, options, action) => {
    const changes = await objectChanges(action, instance);
    const modelName = _.startCase(instance._modelOptions.name.singular);
    const caseId = await getCaseId(modelName, instance, options.transaction);
    const snapshot = await snapshotValues(instance);
    if (_.isEmpty(changes)) return;
    await sequelize.model("data_change_audit").create(
      {
        user: getUserNickname(options, action, modelName),
        action: action,
        modelName,
        modelId: instance.id,
        modelDescription: await getModelDescription(
          modelName,
          instance,
          options.transaction
        ),
        caseId: caseId,
        snapshot: snapshot,
        changes: changes
      },
      {
        transaction: options.transaction
      }
    );
  };

  const snapshotValues = async instance => {
    const snapshotValues = instance.dataValues;
    for (const association of MODEL_ASSOCIATIONS_TO_LOOKUP) {
      await addAssociationDataToSnapshot(instance, snapshotValues, association);
    }
    return snapshotValues;
  };

  const addAssociationDataToSnapshot = async (
    instance,
    snapshotValues,
    association
  ) => {
    if (Object.keys(instance.dataValues).includes(association.foreignKey)) {
      if (instance.dataValues[association.foreignKey]) {
        const associationInstance = await instance.sequelize.models[
          association.modelName
        ].findByPk(instance.dataValues[association.foreignKey]);
        snapshotValues[association.modelName] =
          associationInstance[association.identifyingAttribute];
      } else {
        snapshotValues[association.modelName] =
          instance.dataValues[association.foreignKey];
      }
    }
  };

  const addAssociationDatasToChanges = async (instance, objectChanges) => {
    for (const association of MODEL_ASSOCIATIONS_TO_LOOKUP) {
      await addAssociationDataToChanges(
        instance,
        objectChanges,
        association,
        "previous"
      );
      await addAssociationDataToChanges(
        instance,
        objectChanges,
        association,
        "new"
      );
    }
  };

  const addAssociationDataToChanges = async (
    instance,
    objectChanges,
    association,
    newOrPrevious
  ) => {
    const modelNameCamelCase = _.camelCase(association.modelName);
    if (Object.keys(objectChanges).includes(association.foreignKey)) {
      if (!objectChanges[modelNameCamelCase])
        objectChanges[modelNameCamelCase] = {};
      if (objectChanges[association.foreignKey][newOrPrevious]) {
        const associationInstance = await instance.sequelize.models[
          association.modelName
        ].findByPk(objectChanges[association.foreignKey][newOrPrevious]);
        objectChanges[modelNameCamelCase][newOrPrevious] =
          associationInstance[association.identifyingAttribute];
      } else {
        objectChanges[modelNameCamelCase][newOrPrevious] =
          objectChanges[association.foreignKey][newOrPrevious];
      }
    }
  };

  const getUserNickname = (options, action, modelName) => {
    const userNickname = options.auditUser;
    if (!userNickname)
      throw Boom.badImplementation(
        `User nickname must be given to db query for auditing. (${modelName} ${action})`
      );
    return userNickname;
  };

  const objectChanges = async (action, instance) => {
    if (action === AUDIT_ACTION.DATA_RESTORED) {
      return await restoreObjectChanges(instance);
    }
    if (
      [AUDIT_ACTION.DATA_DELETED, AUDIT_ACTION.DATA_ARCHIVED].includes(action)
    )
      return await deleteObjectChanges(instance);
    return await createOrUpdateObjectChanges(instance);
  };

  const restoreObjectChanges = async instance => {
    const fieldsChanging = Object.keys(instance.dataValues).filter(
      field => !fieldsToIgnore.includes(field)
    );
    const objectChanges = {};
    _.forEach(fieldsChanging, field => {
      objectChanges[field] = {
        new: instance[field]
      };
    });
    await addAssociationDatasToChanges(instance, objectChanges);
    return objectChanges;
  };

  const createOrUpdateObjectChanges = async instance => {
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
    await addAssociationDatasToChanges(instance, objectChanges);
    return objectChanges;
  };

  const deleteObjectChanges = async instance => {
    const fieldsChanging = Object.keys(instance.dataValues).filter(
      key => !fieldsToIgnore.includes(key)
    );

    const objectChanges = {};
    _.forEach(fieldsChanging, field => {
      objectChanges[field] = {
        previous: instance[field]
      };
    });
    await addAssociationDatasToChanges(instance, objectChanges);
    return objectChanges;
  };
};
