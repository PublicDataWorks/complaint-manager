import {
  CASE_STATUS,
  CIVILIAN_INITIATED,
  RANK_INITIATED
} from "../../sharedUtilities/constants";

export default (sequelize, DataTypes) => {
  const SortableCasesView = sequelize.define(
    "sortable_cases_view",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      complaintType: {
        type: DataTypes.ENUM([CIVILIAN_INITIATED, RANK_INITIATED]),
        field: "complaint_type"
      },
      status: {
        type: DataTypes.ENUM([
          CASE_STATUS.INITIAL,
          CASE_STATUS.ACTIVE,
          CASE_STATUS.LETTER_IN_PROGRESS,
          CASE_STATUS.READY_FOR_REVIEW,
          CASE_STATUS.FORWARDED_TO_AGENCY,
          CASE_STATUS.CLOSED
        ])
      },
      year: {
        type: DataTypes.INTEGER
      },
      caseNumber: {
        field: "case_number",
        type: DataTypes.INTEGER
      },
      firstContactDate: {
        field: "first_contact_date",
        type: DataTypes.DATEONLY
      },
      assignedTo: {
        field: "assigned_to",
        type: DataTypes.STRING
      },
      accusedFirstName: {
        field: "accused_first_name",
        type: DataTypes.STRING
      },
      accusedMiddleName: {
        field: "accused_middle_name",
        type: DataTypes.STRING
      },
      accusedLastName: {
        field: "accused_last_name",
        type: DataTypes.STRING
      },
      accusedOfficerId: {
        field: "accused_officer_id",
        type: DataTypes.INTEGER
      },
      complainantType: {
        field: "complainant_type",
        type: DataTypes.STRING
      },
      complainantFirstName: {
        field: "complainant_first_name",
        type: DataTypes.STRING
      },
      complainantMiddleName: {
        field: "complainant_middle_name",
        type: DataTypes.STRING
      },
      complainantLastName: {
        field: "complainant_last_name",
        type: DataTypes.STRING
      }
    },
    { tableName: "sortable_cases_view", timestamps: false }
  );

  return SortableCasesView;
};
