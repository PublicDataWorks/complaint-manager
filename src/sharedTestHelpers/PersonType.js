import { SHOW_FORM } from "../sharedUtilities/constants";

class PersonType {
  constructor(build) {
    this.key = build.key;
    this.description = build.description;
    this.employeeDescription = build.employeeDescription;
    this.abbreviation = build.abbreviation;
    this.legend = build.legend;
    this.dialogAction = build.dialogAction;
    this.isDefault = build.isDefault;
  }

  //TODO: Builders are not usually part of the class that they're building.  The class is usually a domain object used in the app, not just tests.  Should this be refactored?
  static get Builder() {
    class Builder {
      defaultPersonType() {
        this.key = "PERSON";
        this.description = "Person";
        this.abbreviation = "PP";
        this.legend = "Person (PP)";
        this.dialogAction = SHOW_FORM;
        this.isDefault = false;
        return this;
      }

      withKey(key) {
        this.key = key;
        return this;
      }

      withDescription(description) {
        this.description = description;
        return this;
      }

      withEmployeeDescription(employeeDescription) {
        this.employeeDescription = employeeDescription;
        return this;
      }

      withIsEmployee(isEmployee) {
        this.isemployee = isEmployee;
        return this;
      }

      withAbbreviation(abbreviation) {
        this.abbreviation = abbreviation;
        return this;
      }

      withLegend(legend) {
        this.legend = legend;
        return this;
      }

      withDialogAction(dialogAction) {
        this.dialogAction = dialogAction;
        return this;
      }

      withIsDefault(isDefault) {
        this.isDefault = isDefault;
        return this;
      }

      build() {
        return new PersonType(this);
      }
    }

    return Builder;
  }
}

export default PersonType;
