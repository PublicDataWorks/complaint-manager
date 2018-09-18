const determineNextCaseStatus = require("./modelUtilities/determineNextCaseStatus");
const Boom = require("boom");
const CASE_STATUS = require("../../sharedUtilities/constants").CASE_STATUS;
const RANK_INITIATED = require("../../sharedUtilities/constants")
  .RANK_INITIATED;
const CIVILIAN_INITIATED = require("../../sharedUtilities/constants")
  .CIVILIAN_INITIATED;

const {
  ACCUSED,
  COMPLAINANT,
  WITNESS
} = require("../../sharedUtilities/constants");

module.exports = (sequelize, DataTypes) => {
  const Op = sequelize.Op;

  const Case = sequelize.define(
    "cases",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      complaintType: {
        type: DataTypes.ENUM([CIVILIAN_INITIATED, RANK_INITIATED]),
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
          /***
          NOTE: the third validation:

            (newStatus === CASE_STATUS.READY_FOR_REVIEW &&
              this.status === CASE_STATUS.ACTIVE)

           is only in place due to the letterGenerationToggle toggle.
           Remove this logic when that toggle is removed.
          ***/
          if (
            newStatus === nextStatus ||
            newStatus === this.status ||
            (newStatus === CASE_STATUS.READY_FOR_REVIEW &&
              this.status === CASE_STATUS.ACTIVE)
          ) {
            this.setDataValue("status", newStatus);
          } else {
            throw Boom.badRequest("Invalid case status");
          }
        }
      },
      district: {
        type: DataTypes.STRING
      },
      firstContactDate: {
        field: "first_contact_date",
        type: DataTypes.DATEONLY
      },
      incidentDate: {
        field: "incident_date",
        type: DataTypes.DATEONLY
      },
      incidentTime: {
        field: "incident_time",
        type: DataTypes.TIME
      },
      narrativeSummary: {
        field: "narrative_summary",
        type: DataTypes.STRING(500)
      },
      narrativeDetails: {
        field: "narrative_details",
        type: DataTypes.TEXT
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
      }
    },
    {
      hooks: {
        beforeUpdate: (instance, options) => {
          if (!instance.changed() || instance.changed().includes("status"))
            return;
          if (instance.status === CASE_STATUS.INITIAL) {
            instance.status = CASE_STATUS.ACTIVE;
          }
        }
      },
      getterMethods: {
        nextStatus() {
          return determineNextCaseStatus(this.status);
        }
      }
    }
  );

  Case.prototype.modelDescription = async function(transaction) {
    return [];
  };

  Case.prototype.getCaseId = async function(transaction) {
    return this.id;
  };

  Case.associate = models => {
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
        addressable_type: "cases"
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
    Case.belongsTo(models.classification, {
      foreignKey: {
        name: "classificationId",
        field: "classification_id",
        allowNull: true
      }
    });
    Case.hasMany(models.data_change_audit, {
      as: "dataChangeAudits",
      foreignKey: { name: "caseId", field: "case_id" }
    });
    Case.hasMany(models.action_audit, {
      as: "actionAudits",
      foreignKey: { name: "caseId", field: "case_id" }
    });
  };

  Case.auditDataChange();

  return Case;
};
