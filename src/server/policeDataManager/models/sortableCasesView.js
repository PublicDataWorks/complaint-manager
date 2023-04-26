import {
  CIVILIAN_INITIATED,
  RANK_INITIATED
} from "../../../sharedUtilities/constants";
import { getPersonFullName } from "../../../sharedUtilities/getFullName";
import { getCaseReference } from "./modelUtilities/caseReferenceHelpersFunctions";

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
          "complainantIsAnonymous",
          "complainantAbbreviation"
        ]),
        get: function () {
          if (this.get("complainantFirstName")) {
            return {
              personType: this.get("complainantPersonType") || "Civilian",
              fullName: getPersonFullName(
                this.get("complainantFirstName"),
                this.get("complainantMiddleName"),
                this.get("complainantLastName"),
                this.get("complainantSuffix"),
                this.get("complainantPersonType") || "Civilian"
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
                      element.accused_first_name ===
                        accused.accused_first_name &&
                      element.accused_last_name === accused.accused_last_name &&
                      element.accused_person_type ===
                        accused.accused_person_type
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
        type: DataTypes.STRING
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
          "caseNumber",
          "year",
          "complainantAbbreviation",
          "primaryComplainant"
        ]),
        get: function () {
          return getCaseReference(
            this.get("primaryComplainant")?.isAnonymous
              ? "AC"
              : this.get("complainantAbbreviation"),
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
      },
      complainantAbbreviation: {
        field: "complainant_abbreviation",
        type: DataTypes.STRING
      }
    },
    {
      tableName: "sortable_cases_view",
      timestamps: false
    }
  );

  return SortableCasesView;
};
