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
      complainantType: {
        type: DataTypes.ENUM(["Civilian", "Police Officer"]),
        defaultValue: "Civilian",
        field: "complainant_type"
      },
      status: {
        type: DataTypes.ENUM([
          "Initial",
          "Active",
          "Forwarded",
          "Suspended",
          "Complete"
        ]),
        defaultValue: "Initial"
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
        type: DataTypes.STRING
      },
      assignedTo: {
        field: "assigned_to",
        type: DataTypes.STRING
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
          if (instance.status === "Initial") {
            instance.status = "Active";
          }
        }
      }
    }
  );

  Case.associate = models => {
    Case.hasMany(models.civilian, {
      foreignKey: { name: "caseId", field: "case_id" }
    });
    Case.hasMany(models.attachment, {
      foreignKey: { name: "caseId", field: "case_id" }
    });
    Case.belongsTo(models.address, {
      as: "incidentLocation",
      foreignKey: {
        name: "incidentLocationId",
        field: "incident_location_id",
        allowNull: true
      }
    });
    Case.hasMany(models.case_officer, {
      as: "accusedOfficers",
      foreignKey: { name: "caseId", field: "case_id" },
      scope: { role_on_case: "Accused" }
    });
    Case.hasMany(models.case_officer, {
      as: "complainantWitnessOfficers",
      foreignKey: { name: "caseId", field: "case_id" },
      scope: {
        role_on_case: { [Op.in]: ["Complainant", "Witness"] }
      }
    });
    Case.hasMany(models.data_change_audit, {
      as: "dataChangeAudits",
      foreignKey: { name: "caseId", field: "case_id" }
    });
  };

  Case.prototype.toJSON = function() {
    const {
      accusedOfficers,
      complainantWitnessOfficers,
      ...restOfCase
    } = this.get();

    if (complainantWitnessOfficers) {
      complainantWitnessOfficers.forEach(officer => {
        if (officer.getDataValue("officerId") === null) {
          officer.setDataValue("officer", { fullName: "Unknown Officer" });
        }
      });
    }

    if (accusedOfficers) {
      accusedOfficers.forEach(officer => {
        if (officer.getDataValue("officerId") === null) {
          officer.setDataValue("officer", { fullName: "Unknown Officer" });
        }
      });
    }

    return Object.assign({}, restOfCase, {
      accusedOfficers,
      complainantWitnessOfficers
    });
  };

  Case.auditDataChange();

  return Case;
};
