import Boom from "boom";
import { BAD_REQUEST_ERRORS } from "../../../sharedUtilities/errorMessageConstants";
import determineNextCaseStatus from "../../handlers/cases/helpers/determineNextCaseStatus";

export default class Case {
  constructor(caseModel) {
    // TODO maybe allow the constructor to get the model by id from DB (if needed)
    this._model = caseModel;
    this._status = "Initial";
  }

  get model() {
    return this._model;
  }

  get id() {
    return this._model.id;
  }

  get primaryComplainant() {
    return this._model.primaryComplainant;
  }

  get complaintType() {
    return this._model.complaintType;
  }

  get status() {
    return this._status;
  }

  setStatus = async status => {
    const nextStatus = await determineNextCaseStatus(this.status);
    if (status === nextStatus.name) {
      this._model.currentStatusId = nextStatus.id;
      this._status = nextStatus.name;
    } else if (status !== this.status) {
      throw Boom.badRequest(BAD_REQUEST_ERRORS.INVALID_CASE_STATUS);
    }
  };

  get nextStatus() {
    return determineNextCaseStatus(this.status);
  }

  get year() {
    return this._model.year;
  }

  get caseNumber() {
    return this._model.caseNumber;
  }

  get caseReferencePrefix() {
    return this._model.caseReferencePrefix;
  }

  get caseReference() {
    return this._model.caseReference;
  }

  get firstContactDate() {
    return this._model.firstContactDate;
  }

  get incidentDate() {
    return this._model.incidentDate;
  }

  get intakeSourceId() {
    return this._model.intakeSourceId;
  }

  get districtId() {
    return this._model.districtId;
  }

  get incidentTime() {
    return this._model.incidentTime;
  }

  get incidentTimezone() {
    return this._model.incidentTimezone;
  }

  get narrativeSummary() {
    return this._model.narrativeSummary;
  }

  get narrativeDetails() {
    return this._model.narrativeDetails;
  }

  get pibCaseNumber() {
    return this._model.pibCaseNumber;
  }

  get createdBy() {
    return this._model.createdBy;
  }

  get assignedTo() {
    return this._model.assignedTo;
  }
}
