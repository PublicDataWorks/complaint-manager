import {
  ADDRESSABLE_TYPE,
  MANAGER_TYPE
} from "../../../sharedUtilities/constants";
const {
  CIVILIAN_WITHIN_PD_INITIATED
} = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/constants`);
import moment from "moment";
import { head, isEmpty, sortBy } from "lodash";
import models from "./index";
import winston from "winston";
import {
  BAD_DATA_ERRORS,
  BAD_REQUEST_ERRORS
} from "../../../sharedUtilities/errorMessageConstants";
import {
  getCaseReference,
  getCaseReferencePrefix,
  getPrefix
} from "./modelUtilities/caseReferenceHelpersFunctions";
import { getPersonType } from "./modelUtilities/getPersonType";
import { sanitize } from "../../../sharedUtilities/sanitizeHTML";

const determineNextCaseStatus = require("./modelUtilities/determineNextCaseStatus");
const Boom = require("boom");
const CASE_STATUS = require("../../../sharedUtilities/constants").CASE_STATUS;
const RANK_INITIATED =
  require("../../../sharedUtilities/constants").RANK_INITIATED;
const CIVILIAN_INITIATED =
  require("../../../sharedUtilities/constants").CIVILIAN_INITIATED;

const {
  ACCUSED,
  COMPLAINANT,
  WITNESS
} = require("../../../sharedUtilities/constants");

module.exports = (sequelize, DataTypes) => {
  const Case = sequelize.define(
    "cases",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      primaryComplainant: {
        type: new DataTypes.VIRTUAL(DataTypes.STRING),
        get: function () {
          return head(
            sortBy(
              [
                ...(this.complainantCivilians || []),
                ...(this.complainantOfficers || [])
              ],
              "createdAt"
            )
          );
        }
      },
      complaintType: {
        type: DataTypes.STRING,
        validate: {
          isIn: [
            [CIVILIAN_INITIATED, RANK_INITIATED, CIVILIAN_WITHIN_PD_INITIATED]
          ]
        },
        defaultValue: CIVILIAN_INITIATED,
        field: "complaint_type",
        allowNull: false
      },
      status: {
        type: DataTypes.ENUM([
          CASE_STATUS.INITIAL,
          CASE_STATUS.ACTIVE,
          CASE_STATUS.LETTER_IN_PROGRESS,
          CASE_STATUS.READY_FOR_REVIEW,
          CASE_STATUS.FORWARDED_TO_AGENCY,
          CASE_STATUS.CLOSED
        ]),
        defaultValue: CASE_STATUS.INITIAL,
        allowNull: false,
        set(newStatus) {
          const nextStatus = determineNextCaseStatus(this.status);
          if (newStatus === nextStatus || newStatus === this.status) {
            this.setDataValue("status", newStatus);
          } else {
            throw Boom.badRequest(BAD_REQUEST_ERRORS.INVALID_CASE_STATUS);
          }
        }
      },
      nextStatus: {
        type: new DataTypes.VIRTUAL(DataTypes.STRING, ["status"]),
        get: function () {
          return determineNextCaseStatus(this.get("status"));
        }
      },
      year: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      caseNumber: {
        field: "case_number",
        type: DataTypes.INTEGER,
        allowNull: false
      },
      caseReferencePrefix: {
        type: new DataTypes.VIRTUAL(DataTypes.STRING, ["primaryComplainant"]),
        get: function () {
          const primaryComplainant = this.get("primaryComplainant");
          return getCaseReferencePrefix(
            primaryComplainant && primaryComplainant.isAnonymous,
            getPersonType(this.get("primaryComplainant"))
          );
        }
      },
      caseReference: {
        type: new DataTypes.VIRTUAL(DataTypes.STRING, [
          "caseReferencePrefix",
          "caseNumber",
          "year"
        ]),
        get: function () {
          return getCaseReference(
            this.get("caseReferencePrefix"),
            this.get("caseNumber"),
            this.get("year")
          );
        }
      },
      firstContactDate: {
        field: "first_contact_date",
        type: DataTypes.DATEONLY
      },
      incidentDate: {
        field: "incident_date",
        type: DataTypes.DATEONLY
      },
      intakeSourceId: {
        type: DataTypes.INTEGER,
        field: "intake_source_id",
        references: {
          model: models.intake_source,
          key: "id"
        }
      },
      districtId: {
        type: DataTypes.INTEGER,
        field: "district_id",
        references: {
          model: models.district,
          key: "id"
        }
      },
      incidentTime: {
        field: "incident_time",
        type: DataTypes.TIME
      },
      incidentTimezone: {
        field: "incident_timezone",
        type: DataTypes.STRING
      },
      narrativeSummary: {
        field: "narrative_summary",
        type: DataTypes.STRING(500),
        set: function (value) {
          if (value !== null) {
            this.setDataValue("narrativeSummary", sanitize(value));
          }
        }
      },
      narrativeDetails: {
        field: "narrative_details",
        type: DataTypes.TEXT,
      },
      pibCaseNumber: {
        field: "pib_case_number",
        type: DataTypes.STRING(25),
        set: function (value) {
          if (value !== null) {
            this.setDataValue("pibCaseNumber", sanitize(value));
          }
        }
      },
      createdBy: {
        field: "created_by",
        type: DataTypes.STRING,
        allowNull: false
      },
      assignedTo: {
        field: "assigned_to",
        type: DataTypes.STRING,
        allowNull: false
      },
      createdAt: {
        field: "created_at",
        type: DataTypes.DATE
      },
      updatedAt: {
        field: "updated_at",
        type: DataTypes.DATE
      },
      deletedAt: {
        field: "deleted_at",
        type: DataTypes.DATE,
        as: "deletedAt"
      }
    },
    {
      paranoid: true,
      hooks: {
        beforeBulkCreate: (instances, options) => {
          restrictBulkCreate();
        },
        beforeBulkUpdate: options => {
          restrictEditingOfCaseReferenceNumberBulkUpdate(options);
        },
        beforeUpdate: (instance, options) => {
          restrictEditingOfCaseReferenceNumber(instance, options);
          if (!instance.changed() || instance.changed().includes("status"))
            return;
          if (instance.status === CASE_STATUS.INITIAL) {
            instance.status = CASE_STATUS.ACTIVE;
          }
        },
        beforeCreate: async (instance, options) => {
          if (options.validate === false) {
            instance.generateCaseNumberAndYear(instance, options);
          }
        },
        beforeValidate: (instance, options) => {
          instance.generateCaseNumberAndYear(instance, options);
        }
      }
    }
  );

  Case.prototype.generateCaseNumberAndYear = (instance, options) => {
    // Generate case number if creating new record
    // Note: We cannot use Postgres sequence b/c we need to reset each year and a cron to reset sequence once a year seems risky
    // Note: We cannot lock table for update on aggregate function, so will retry on unique key violation
    if (instance.isNewRecord) {
      const caseReferenceYear =
        instance.firstContactDate &&
        moment(instance.firstContactDate).format("YYYY");
      const subqueryForNextCaseNumberThisYear = instance.sequelize.literal(
        `COALESCE((SELECT max(case_number) + 1 FROM cases where year = ${caseReferenceYear}), 1)`
      ); //this won't execute until the create statement executes
      instance.year = caseReferenceYear;
      instance.caseNumber = subqueryForNextCaseNumberThisYear;
    }
  };

  const restrictEditingOfCaseReferenceNumber = (instance, options) => {
    if (
      instance.changed() &&
      (instance.changed().includes("year") ||
        instance.changed().includes("caseNumber"))
    ) {
      throw Boom.badData(BAD_DATA_ERRORS.CANNOT_OVERRIDE_CASE_REFERENCE);
    }
  };

  const restrictEditingOfCaseReferenceNumberBulkUpdate = options => {
    if (
      options.fields.includes("year") ||
      options.fields.includes("caseNumber")
    ) {
      throw Boom.badData(BAD_DATA_ERRORS.CANNOT_OVERRIDE_CASE_REFERENCE);
    }
  };

  const restrictBulkCreate = () => {
    winston.error(
      "We have not implemented bulk create. If you choose implement, be sure to handle case reference number generation."
    );
    throw Boom.badRequest(BAD_REQUEST_ERRORS.ACTION_NOT_ALLOWED);
  };

  Case.prototype.hasValueWhenLetterInProgress = function (field, value) {
    if (
      [
        CASE_STATUS.LETTER_IN_PROGRESS,
        CASE_STATUS.READY_FOR_REVIEW,
        CASE_STATUS.FORWARDED_TO_AGENCY,
        CASE_STATUS.CLOSED
      ].includes(this.status)
    ) {
      if (value === null || isEmpty(value)) {
        throw { model: "Case", errorMessage: `${field} is required` };
      }
    }
  };

  Case.prototype.modelDescription = async function (transaction) {
    return [{ "Case Reference": this.caseReference }];
  };

  Case.prototype.getCaseId = async function (transaction) {
    return this.id;
  };

  Case.prototype.getManagerType = async function (transaction) {
    return MANAGER_TYPE.COMPLAINT;
  };

  Case.associate = models => {
    Case.hasMany(models.audit, {
      foreignKey: { name: "referenceId", field: "reference_id" },
      scope: {
        managerType: MANAGER_TYPE.COMPLAINT
      }
    });
    Case.hasMany(models.civilian, {
      as: "complainantCivilians",
      foreignKey: { name: "caseId", field: "case_id" },
      scope: { role_on_case: COMPLAINANT }
    });
    Case.hasMany(models.civilian, {
      as: "witnessCivilians",
      foreignKey: { name: "caseId", field: "case_id" },
      scope: { role_on_case: WITNESS }
    });
    Case.hasMany(models.attachment, {
      foreignKey: { name: "caseId", field: "case_id" }
    });
    Case.hasOne(models.address, {
      as: "incidentLocation",
      foreignKey: {
        name: "addressableId",
        field: "addressable_id"
      },
      scope: {
        addressable_type: ADDRESSABLE_TYPE.CASES
      }
    });
    Case.hasMany(models.case_officer, {
      as: "accusedOfficers",
      foreignKey: { name: "caseId", field: "case_id" },
      scope: { role_on_case: ACCUSED }
    });
    Case.hasMany(models.case_officer, {
      as: "complainantOfficers",
      foreignKey: { name: "caseId", field: "case_id" },
      scope: { role_on_case: COMPLAINANT }
    });
    Case.hasMany(models.case_officer, {
      as: "witnessOfficers",
      foreignKey: { name: "caseId", field: "case_id" },
      scope: { role_on_case: WITNESS }
    });
    Case.hasMany(models.case_classification, {
      as: "caseClassifications",
      foreignKey: {
        name: "caseId",
        field: "case_id"
      }
    });
    Case.belongsTo(models.how_did_you_hear_about_us_source, {
      as: "howDidYouHearAboutUsSource",
      name: "howDidYouHearAboutUsSourceId",
      foreignKey: {
        field: "how_did_you_hear_about_us_source_id",
        allowNull: true
      }
    });
    Case.belongsTo(models.intake_source, {
      as: "intakeSource",
      foreignKey: {
        name: "intakeSourceId",
        field: "intake_source_id",
        allowNull: true
      }
    });
    Case.belongsTo(models.district, {
      as: "caseDistrict",
      foreignKey: {
        name: "districtId",
        field: "district_id",
        allowNull: true
      }
    });
    Case.hasMany(models.legacy_data_change_audit, {
      as: "dataChangeAudits",
      foreignKey: { name: "caseId", field: "case_id" }
    });
    Case.hasMany(models.action_audit, {
      as: "actionAudits",
      foreignKey: { name: "caseId", field: "case_id" }
    });
    Case.hasOne(models.referral_letter, {
      as: "referralLetter",
      foreignKey: { name: "caseId", field: "case_id" }
    });
    Case.hasMany(models.case_tag, {
      as: "caseTags",
      foreignKey: { name: "caseId", field: "case_id" }
    });
  };

  Case.auditDataChange();

  return Case;
};
