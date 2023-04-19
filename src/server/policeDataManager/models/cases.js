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

const Boom = require("boom");

const {
  ACCUSED,
  COMPLAINANT,
  WITNESS
} = require("../../../sharedUtilities/constants");

module.exports = (sequelize, DataTypes) => {
  /**
   * Case model - represents a case in the cases table
   * Fields:
   * @property id {number} - the numeric id of the case
   * @property primaryComplainant {Civilian | CaseOfficer | CaseInmate} - VIRTUAL holds the complainant (of whatever type) that was added first (duplicated from civilianComplainants, officerComplainants, or inmateComplainants)
   * @property complaintTypeId {string} - the foreign key to the complaint_types table
   * @property statusId {number} - a foreign key to the case_status table, indicating the status of the case
   * @property year {string} - the four digit year of the case
   * @property caseNumber {number} - the number of the case (separate from the id), used to generate the case reference
   * @property caseReferencePrefix {string} - VIRTUAL the alphabetical prefix to a case reference number, determined by the type of the primary complainant
   * @property caseReference {string} - VIRTUAL the case identifier used for display purposes, constructed from the prefix ^^, the year, and the case number padded to 4 digits
   * @property firstContactDate {Date} - the date that the first complainant first contacted oversight about the case
   * @property intakeSourceId {number} - a foreign key to the intake_sources table, indicating the source through which the complaint came in
   * @property incidentDate {Date} - The date at which the incident took place
   * @property districtId {number} - a foreign key to the districts table, indicating the district in which the case took place
   * @property incidentTime {Time} - The time at which the incident took place
   * @property incidentTimeZone {string} - The timezone of the incident time
   * @property narrativeSummary {string} - A summary of the events of the case
   * @property narrativeDetails {string} - An HTML string with a narrative description of the case to be used when reporting the case
   * @property pibCaseNumber {string} - The external case number related to the case
   * @property createdBy {string} - The username of the user who created the case
   * @property assignedTo {string} - The username of the user to whom the case is assigned
   *
   * Associations:
   * @property audit (One to Many) - changes/data accesses on the case
   * @property complainantCivilians (One to Many) - Civilians who have the role of Complainant on the case
   * @property witnessCivilians (One to Many) - Civilians who have the role of Witness on the case
   * @property accusedCivilians (One to Many) - Civilians who have the role of Accused on the case
   * @property attachment (One to Many) - References to files attached to the case (not the actual files, which are in S3)
   * @property incidentLocation (One to One) - The address at which the incident occurred
   * @property accusedOfficers (Many to Many) - The officers who have the role of Accused on the case (connected through cases_officers table)
   * @property complainantOfficers (Many to Many) - The officers who have the role of Complainant on the case (connected through cases_officers table)
   * @property witnessOfficers (Many to Many) - The officers who have the role of Witness on the case (connected through cases_officers table)
   * @property complainantInmates (Many to Many) - The people in custody who have the role of Complainant on the case (connected through cases_inmates table)
   * @property witnessInmates (Many to Many) - The people in custody who have the role of Witness on the case (connected through cases_inmates table)
   * @property accusedInmates (Many to Many) - The people in custody who have the role of Accused on the case (connected through cases_inmates table)
   * @property caseClassifications (Many to Many) - classifications added to the case (connected by case_classifications)
   * @property howDidYouHearAboutUsSource (Many to One) - the place where the complainant heard about the oversight org
   * @property intakeSource (Many to One) - the manner in which the complaint was intaken
   * @property caseDistrict (Many to One) - The district in which the incident occurred
   * @property dataChangeAudits (One to Many) - Records of changes to the case data
   * @property actionAudits (One to Many) - Records of actions taken
   * @property referralLetter (One to One) - The referral letter generated for the case (if there is one)
   * @property caseTags (Many to Many) - The tags applied to the case (associated through case_tags table)
   * @property status (Many to One) - The status of the case (statuses have their own table so that different orgs can have different statuses)
   * @property complaintType (Many to One) - The type of complaint
   */
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
                ...(this.complainantOfficers || []),
                ...(this.complainantInmates || [])
              ],
              "createdAt"
            )
          );
        }
      },
      complaintTypeId: {
        type: DataTypes.STRING,
        field: "complaint_type_id"
      },
      statusId: {
        field: "status",
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: models.caseStatus,
          key: "id"
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
        type: DataTypes.TEXT
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

  Case.prototype.modelDescription = async function (transaction) {
    return [{ "Case Reference": this.caseReference }];
  };

  Case.prototype.getCaseId = async function (transaction) {
    return this.id;
  };

  Case.prototype.getManagerType = async function (transaction) {
    return MANAGER_TYPE.COMPLAINT;
  };

  // TODO check if these are needed
  Case.prototype.updateCaseStatusId = () => {
    return this.setDataValue(
      "statusId",
      this.caseStatus.determineCaseStatus(this.status.name)
    );
  };

  Case.prototype.getCurrentStatus = () => {
    return this.caseStatus.determineCaseStatus(this.status.name);
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
    Case.hasMany(models.civilian, {
      as: "accusedCivilians",
      foreignKey: { name: "caseId", field: "case_id" },
      scope: { role_on_case: ACCUSED }
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
    Case.hasMany(models.caseInmate, {
      as: "complainantInmates",
      foreignKey: { name: "caseId", field: "case_id" },
      scope: { role_on_case: COMPLAINANT }
    });
    Case.hasMany(models.caseInmate, {
      as: "witnessInmates",
      foreignKey: { name: "caseId", field: "case_id" },
      scope: { role_on_case: WITNESS }
    });
    Case.hasMany(models.caseInmate, {
      as: "accusedInmates",
      foreignKey: { name: "caseId", field: "case_id" },
      scope: { role_on_case: ACCUSED }
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
    Case.belongsTo(models.caseStatus, {
      as: "status",
      foreignKey: {
        name: "statusId",
        field: "status",
        allowNull: false
      }
    });
    Case.belongsTo(models.complaintTypes, {
      as: "complaintType",
      foreignKey: {
        name: "complaintTypeId"
      }
    });
  };

  Case.auditDataChange();
  return Case;
};
