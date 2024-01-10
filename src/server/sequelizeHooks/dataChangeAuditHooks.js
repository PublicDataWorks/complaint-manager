const { AUDIT_ACTION } = require("../../sharedUtilities/constants");
const _ = require("lodash");
const Boom = require("boom");

const MODEL_ASSOCIATIONS_TO_LOOKUP = [
  {
    foreignKey: "classificationId",
    modelName: "classification",
    identifyingAttribute: "name",
    as: "classification"
  },
  {
    foreignKey: "recommendedActionId",
    modelName: "recommended_action",
    identifyingAttribute: "description",
    as: "recommendedAction"
  },
  {
    foreignKey: "intakeSourceId",
    modelName: "intake_source",
    identifyingAttribute: "name",
    as: "intakeSource"
  },
  {
    foreignKey: "priorityLevels",
    modelName: "priority_levels",
    identifyingAttribute: "name",
    as: "priorityLevel"
  },
  {
    foreignKey: "priorityReasons",
    modelName: "priority_reasons",
    identifyingAttribute: "name",
    as: "priorityReason"
  },
  {
    foreignKey: "raceEthnicityId",
    modelName: "race_ethnicity",
    identifyingAttribute: "name",
    as: "raceEthnicity"
  },
  {
    foreignKey: "howDidYouHearAboutUsSourceId",
    modelName: "how_did_you_hear_about_us_source",
    identifyingAttribute: "name",
    as: "howDidYouHearAboutUsSource"
  },
  {
    foreignKey: "genderIdentityId",
    modelName: "gender_identity",
    identifyingAttribute: "name",
    as: "genderIdentity"
  },
  {
    foreignKey: "civilianTitleId",
    modelName: "civilian_title",
    identifyingAttribute: "name",
    as: "civilianTitle"
  },
  {
    foreignKey: "districtId",
    modelName: "district",
    identifyingAttribute: "name",
    as: "district"
  }
];

exports.init = (sequelize, model) => {
  const originalCreate = model.create;
  const originalUpdate = model.update;
  const originalInstanceUpdate = model.prototype.update;
  const originalDestroy = model.destroy;
  const originalInstanceDestroy = model.prototype.destroy;
  const originalRestore = model.restore;
  const originalInstanceRestore = model.prototype.restore;

  const fieldsToIgnore = [
    "createdAt",
    "updatedAt",
    "createdBy",
    "deletedAt",
    "deleted_at"
  ];

  model.prototype.update = async function (values, options = {}) {
    return await addTransactionToFunction(
      originalInstanceUpdate,
      values,
      options,
      this
    );
  };

  model.prototype.destroy = async function (options = {}) {
    return await addTransactionToFunctionWithoutValues(
      originalInstanceDestroy,
      options,
      this
    );
  };

  model.prototype.restore = async function (options = {}) {
    return await addTransactionToFunctionWithoutValues(
      originalInstanceRestore,
      options,
      this
    );
  };

  _.extend(model, {
    auditDataChange: function () {
      this.addHook("afterCreate", afterCreateHook);
      this.addHook("afterUpdate", afterUpdateHook);
      this.addHook("afterDestroy", afterDestroyHook);
      this.addHook("afterRestore", afterRestoreHook);
      this.addHook("beforeUpsert", raiseAuditException);
    },
    create: async function (values, options = {}) {
      options.individualHooks = true;
      return await addTransactionToFunction(
        originalCreate,
        values,
        options,
        this
      );
    },
    update: async function (values, options = {}) {
      options.individualHooks = true;
      return await addTransactionToFunction(
        originalUpdate,
        values,
        options,
        this
      );
    },
    destroy: async function (options = {}) {
      options.individualHooks = true;
      return await addTransactionToFunctionWithoutValues(
        originalDestroy,
        options,
        this
      );
    },
    restore: async function (options = {}) {
      options.individualHooks = true;
      return await addTransactionToFunctionWithoutValues(
        originalRestore,
        options,
        this
      );
    }
  });

  const addTransactionToFunction = async function (
    originalFunction,
    values,
    options,
    thisReference
  ) {
    try {
      if (options.transaction) {
        return await originalFunction.bind(thisReference)(values, options);
      }

      return await sequelize.transaction(async t => {
        options.transaction = t;
        return await originalFunction.bind(thisReference)(values, options);
      });
    } catch (e) {
      console.log("error while calling query", originalFunction, e);
      throw e;
    }
  };

  const addTransactionToFunctionWithoutValues = async function (
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
      instance.constructor.options.name.singular === "case"
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

  const getManagerType = async (modelName, instance, transaction) => {
    if (instance.getManagerType) {
      return await instance.getManagerType(transaction);
    }

    throw Boom.badImplementation(
      `Model must implement getManagerType (${modelName})`
    );
  };

  const referenceDictionary = {
    complaint: "getCaseId"
  };

  const getReferenceId = async (
    managerType,
    modelName,
    instance,
    transaction
  ) => {
    const instanceIdFunction = referenceDictionary[managerType];
    if (instance[instanceIdFunction]) {
      return await instance[instanceIdFunction](transaction);
    }
    throw Boom.badImplementation(
      `Model must implement ${instanceIdFunction} (${modelName})`
    );
  };
  const getModelName = instance => {
    const pluralName = instance.constructor.options.name.plural;
    const singularName = instance.constructor.options.name.singular;

    if (sequelize.models[pluralName]) {
      return pluralName;
    } else {
      return singularName;
    }
  };

  const createDataChangeAudit = async (instance, options, action) => {
    const changes = await objectChanges(action, instance);

    const modelName = getModelName(instance);
    const formattedModelName = _.startCase(
      instance.constructor.options.name.singular
    );

    const managerType = await getManagerType(
      formattedModelName,
      instance,
      options.transaction
    );

    const referenceId = await getReferenceId(
      managerType,
      formattedModelName,
      instance,
      options.transaction
    );
    const snapshot = await snapshotValues(instance);
    if (_.isEmpty(changes)) return;
    const dataChangeAudit = await sequelize.model("audit").create(
      {
        user: getUserNickname(options, action, formattedModelName),
        auditAction: action,
        referenceId: referenceId,
        managerType: managerType,
        dataChangeAudit: {
          modelName: modelName,
          modelDescription: await getModelDescription(
            formattedModelName,
            instance,
            options.transaction
          ),
          modelId: instance.id,
          snapshot: snapshot,
          changes: changes
        }
      },
      {
        include: [
          {
            model: sequelize.model("data_change_audit"),
            as: "dataChangeAudit"
          }
        ],
        transaction: options.transaction
      }
    );
  };

  const snapshotValues = async instance => {
    const snapshotValues = instance.get();
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
    const snapshotKey = association.as ? association.as : association.modelName;

    if (Object.keys(instance.dataValues).includes(association.foreignKey)) {
      if (instance.dataValues[association.foreignKey]) {
        const associationInstance = await instance.sequelize.models[
          association.modelName
        ].findByPk(instance.dataValues[association.foreignKey]);
        snapshotValues[snapshotKey] =
          associationInstance[association.identifyingAttribute];
      } else {
        snapshotValues[snapshotKey] =
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
