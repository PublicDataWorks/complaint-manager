//TODO Should we use a Civilian class in our app code?
import Address from "./Address";
import { ADDRESSABLE_TYPE, COMPLAINANT } from "../sharedUtilities/constants";

class Civilian {
  constructor(build) {
    this.id = build.id;
    this.createdAt = build.createdAt;
    this.caseId = build.caseId;
    this.firstName = build.firstName;
    this.middleInitial = build.middleInitial;
    this.lastName = build.lastName;
    this.suffix = build.suffix;
    this.roleOnCase = build.roleOnCase;
    this.phoneNumber = build.phoneNumber;
    this.birthDate = build.birthDate;
    this.email = build.email;
    this.raceEthnicityId = build.raceEthnicityId;
    this.genderIdentityId = build.genderIdentityId;
    this.address = build.address;
    this.additionalInfo = build.additionalInfo;
    this.isAnonymous = build.isAnonymous;
    this.fullName = build.fullName;
    this.civilianTitleId = build.civilianTitleId;
    this.civilianTitle = build.civilianTitle;
    this.personType = build.personType;
  }

  //TODO: Builders are not usually part of the class that they're building.  The class is usually a domain object used in the app, not just tests.  Should this be refactored?
  static get Builder() {
    class Builder {
      defaultCivilian() {
        const id = 17;
        const address = new Address.Builder()
          .defaultAddress()
          .withAddressableId(id)
          .withAddressableType(ADDRESSABLE_TYPE.CIVILIAN)
          .build();

        this.id = id;
        this.caseId = 17;
        this.firstName = "Chuck";
        this.middleInitial = "E";
        this.lastName = "Berry";
        this.suffix = "XVI";
        this.roleOnCase = COMPLAINANT;
        this.phoneNumber = "1234567890";
        this.email = "cberry@cberry.com";
        this.birthDate = "1994-04-24";
        this.genderIdentityId = null;
        this.raceEthnicityId = undefined;
        this.address = address;
        this.additionalInfo =
          "Some additional information about this civilian.";
        this.isAnonymous = false;
        this.fullName = "Chuck E. Berry XVI";
        this.civilianTitleId = null;
        this.civilianTitle = null;
        return this;
      }

      withNoAddress() {
        this.address = null;
        return this;
      }

      withClearedOutAddress() {
        this.address = {
          id: undefined,
          streetAddress: "",
          streetAddress2: "",
          city: "",
          state: "",
          zipCode: "",
          country: ""
        };
        return this;
      }

      withAddress(address) {
        this.address = address;
        return this;
      }

      withId(id) {
        this.id = id;
        return this;
      }

      withCaseId(caseId) {
        this.caseId = caseId;
        return this;
      }

      withCreatedAt(createdAt) {
        this.createdAt = createdAt;
        return this;
      }

      withFirstName(firstName) {
        this.firstName = firstName;
        return this;
      }

      withMiddleInitial(middleInitial) {
        this.middleInitial = middleInitial;
        return this;
      }

      withLastName(lastName) {
        this.lastName = lastName;
        return this;
      }

      withSuffix(suffix) {
        this.suffix = suffix;
        return this;
      }

      withRoleOnCase(roleOnCase) {
        this.roleOnCase = roleOnCase;
        return this;
      }

      withPhoneNumber(phoneNumber) {
        this.phoneNumber = phoneNumber;
        return this;
      }

      withBirthDate(birthDate) {
        this.birthDate = birthDate;
        return this;
      }

      withEmail(email) {
        this.email = email;
        return this;
      }

      withGenderIdentityId(genderIdentityId) {
        this.genderIdentityId = genderIdentityId;
        return this;
      }

      withAdditionalInfo(additionalInfo) {
        this.additionalInfo = additionalInfo;
        return this;
      }

      withIsAnonymous(isAnonymous) {
        this.isAnonymous = isAnonymous;
        return this;
      }

      withFullName(fullName) {
        this.fullName = fullName;
        return this;
      }

      withCivilianTitleId(civilianTitleId) {
        this.civilianTitleId = civilianTitleId;
        return this;
      }

      withCivilianTitle(civilianTitle) {
        this.civilianTitle = civilianTitle;
        return this;
      }

      withRaceEthnicityId(raceEthnicityId) {
        this.raceEthnicityId = raceEthnicityId;
        return this;
      }

      withPersonType(personType) {
        this.personType = personType;
        return this;
      }

      build() {
        return new Civilian(this);
      }
    }

    return Builder;
  }
}

export default Civilian;
