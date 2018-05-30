"use strict";

module.exports = (sequelize, DataTypes) => {
  const CaseOfficer = sequelize.define(
    "case_officer",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      firstName: {
        field: "first_name",
        type: DataTypes.STRING,
        allowNull: true
      },
      middleName: {
        field: "middle_name",
        type: DataTypes.STRING,
        allowNull: true
      },
      lastName: {
        field: "last_name",
        type: DataTypes.STRING,
        allowNull: true
      },
      windowsUsername: {
        field: "windows_username",
        type: DataTypes.INTEGER,
        allowNull: true
      },
      supervisorFirstName: {
        field: "supervisor_first_name",
        type: DataTypes.STRING,
        allowNull: true
      },
      supervisorMiddleName: {
        field: "supervisor_middle_name",
        type: DataTypes.STRING,
        allowNull: true
      },
      supervisorLastName: {
        field: "supervisor_last_name",
        type: DataTypes.STRING,
        allowNull: true
      },
      supervisorWindowsUsername: {
        field: "supervisor_windows_username",
        type: DataTypes.INTEGER,
        allowNull: true
      },
      supervisorOfficerNumber: {
        field: "supervisor_officer_number",
        type: DataTypes.INTEGER,
        allowNull: true
      },
      employeeType: {
        field: "employee_type",
        type: DataTypes.ENUM(["Commissioned", "Non-Commissioned", "Recruit"]),
        allowNull: true
      },
      district: {
        type: DataTypes.STRING,
        allowNull: true
      },
      bureau: {
        type: DataTypes.STRING,
        allowNull: true
      },
      rank: {
        type: DataTypes.STRING,
        allowNull: true
      },
      dob: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      endDate: {
        field: "end_date",
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      sex: {
        type: DataTypes.STRING,
        allowNull: true
      },
      race: {
        type: DataTypes.STRING,
        allowNull: true
      },
      workStatus: {
        field: "work_status",
        type: DataTypes.STRING,
        allowNull: true
      },
      notes: {
        type: DataTypes.TEXT
      },
      roleOnCase: {
        field: "role_on_case",
        type: DataTypes.ENUM(["AccusedOfficer"])
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
        type: DataTypes.DATE
      }
    },
    {
      tableName: "cases_officers",
      paranoid: true
    }
  );

  CaseOfficer.associate = models => {
    CaseOfficer.belongsTo(models.officer, {
      foreignKey: { name: "officerId", field: "officer_id" }
    });
  };

  return CaseOfficer;
};
