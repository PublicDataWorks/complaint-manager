import {
  CASE_STATUS,
  CIVILIAN_INITIATED,
  RANK_INITIATED
} from "../../../sharedUtilities/constants";
import {
  getOfficerFullName,
  getPersonFullName
} from "../../../sharedUtilities/getFullName";
import {
  getCaseReference,
  getCaseReferencePrefix
} from "./modelUtilities/caseReferenceHelpersFunctions";
import { PERSON_TYPE } from "../../../instance-files/constants";

module.exports = (sequelize, DataTypes) => {
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
      primaryComplainant: {
        type: DataTypes.VIRTUAL(DataTypes.STRING, [
          "complainantPersonType",
          "complainantFirstName",
          "complainantMiddleName",
          "complainantLastName",
          "complainantSuffix",
          "complainantPersonType",
          "complainantIsAnonymous"
        ]),
        get: function () {
          if (this.get("complainantPersonType")) {
            return {
              personType: this.get("complainantPersonType"),
              fullName: getPersonFullName(
                this.get("complainantFirstName"),
                this.get("complainantMiddleName"),
                this.get("complainantLastName"),
                this.get("complainantSuffix"),
                this.get("complainantPersonType")
              ),
              isAnonymous: this.get("complainantIsAnonymous")
            };
          } else {
            return null;
          }
        }
      },
      accusedOfficers: {
        field: "accused_officers",
        type: DataTypes.JSON,
        get: function () {
          if (
            this.getDataValue("accusedOfficers") &&
            this.getDataValue("accusedOfficers").length &&
            this.getDataValue("accusedOfficers")[0]
          ) {
            return this.getDataValue("accusedOfficers")
              .reduce((acc, accused) => {
                if (
                  !acc.length ||
                  !acc.find(
                    element =>
                      element.case_officer_id === accused.case_officer_id
                  )
                ) {
                  acc.push(accused);
                }
                return acc;
              }, [])
              .map(accused => ({
                personType: accused.accused_person_type,
                fullName: getPersonFullName(
                  accused.accused_first_name,
                  accused.accused_middle_name,
                  accused.accused_last_name,
                  null,
                  accused.accused_person_type
                )
              }));
          } else {
            return [];
          }
        }
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
      caseReference: {
        type: new DataTypes.VIRTUAL(DataTypes.STRING, [
          "primaryComplainant",
          "caseNumber",
          "year"
        ]),
        get: function () {
          const primaryComplainant = this.get("primaryComplainant");
          const primaryComplainantPersonType = primaryComplainant
            ? primaryComplainant.personType
            : null;
          const caseReferencePrefix = getCaseReferencePrefix(
            primaryComplainant && primaryComplainant.isAnonymous,
            primaryComplainantPersonType
          );
          return getCaseReference(
            caseReferencePrefix,
            this.get("caseNumber"),
            this.get("year")
          );
        }
      },
      firstContactDate: {
        field: "first_contact_date",
        type: DataTypes.DATEONLY
      },
      tagNames: {
        field: "tag_names",
        type: DataTypes.ARRAY(DataTypes.STRING),
        get: function () {
          return this.getDataValue("tagNames").reduce((acc, tagName) => {
            if (!acc.includes(tagName)) {
              acc.push(tagName);
            }
            return acc;
          }, []);
        }
      },
      deletedAt: {
        field: "deleted_at",
        type: DataTypes.DATEONLY
      },
      assignedTo: {
        field: "assigned_to",
        type: DataTypes.STRING
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
      },
      complainantIsAnonymous: {
        field: "complainant_is_anonymous",
        type: DataTypes.BOOLEAN
      }
    },
    {
      tableName: "sortable_cases_view",
      timestamps: false
    }
  );

  return SortableCasesView;
};
