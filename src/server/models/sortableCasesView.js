import {
  CASE_STATUS,
  CIVILIAN_INITIATED,
  PERSON_TYPE,
  RANK_INITIATED
} from "../../sharedUtilities/constants";
import { getCaseReference } from "./modelUtilities/getCaseReference";
import {
  getOfficerFullName,
  getPersonFullName
} from "./modelUtilities/getFullName";

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
      deletedAt: {
        field: "deleted_at",
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
      accusedPersonType: {
        field: "accused_person_type",
        type: DataTypes.BOOLEAN
      },
      complainantPersonType: {
        field: "complainant_person_type",
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
      },
      complainantSuffix: {
        field: "complainant_suffix",
        type: DataTypes.STRING
      }
    },
    {
      getterMethods: {
        caseReference() {
          return getCaseReference(
            this.complaintType,
            this.caseNumber,
            this.year
          );
        },
        primaryComplainant() {
          if (this.complainantPersonType) {
            return {
              personType: this.complainantPersonType,
              fullName: getPersonFullName(
                this.complainantFirstName,
                this.complainantMiddleName,
                this.complainantLastName,
                this.complainantSuffix,
                this.complainantPersonType
              )
            };
          } else {
            return null;
          }
        },
        primaryAccusedOfficer() {
          if (this.accusedPersonType) {
            return {
              fullName: getOfficerFullName(
                this.accusedFirstName,
                this.accusedMiddleName,
                this.accusedLastName,
                this.accusedPersonType === PERSON_TYPE.UNKNOWN_OFFICER
              )
            };
          } else {
            return null;
          }
        }
      },
      tableName: "sortable_cases_view",
      timestamps: false
    }
  );

  return SortableCasesView;
};
