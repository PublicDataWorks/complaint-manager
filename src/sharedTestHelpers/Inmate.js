import { CASE_STATUS } from "../sharedUtilities/constants";

class Inmate {
  constructor(build) {
    this.inmateId = build.inmateId;
    this.firstName = build.firstName;
    this.lastName = build.lastName;
    this.region = build.region;
    this.facility = build.facility;
    this.locationSub1 = build.locationSub1;
    this.locationSub2 = build.locationSub2;
    this.locationSub3 = build.locationSub3;
    this.locationSub4 = build.locationSub4;
    this.housing = build.housing;
    this.currentLocation = build.currentLocation;
    this.status = build.status;
    this.custodyStatus = build.custodyStatus;
    this.custodyStatusReason = build.custodyStatusReason;
    this.securityClassification = build.securityClassification;
    this.gender = build.gender;
    this.primaryEthnicity = build.primaryEthnicity;
    this.race = build.race;
    this.muster = build.muster;
    this.indigent = build.indigent;
    this.releaseType = build.releaseType;
    this.classificationDate = build.classificationDate;
    this.bookingStartDate = build.bookingStartDate;
    this.tentativeReleaseDate = build.tentativeReleaseDate;
    this.bookingEndDate = build.bookingEndDate;
    this.actualReleaseDate = build.actualReleaseDate;
    this.weekender = build.weekender;
    this.dateOfBirth = build.dateOfBirth;
    this.age = build.age;
    this.countryOfBirth = build.countryOfBirth;
    this.citizenship = build.citizenship;
    this.religion = build.religion;
    this.language = build.language;
    this.dateDeathRecorded = build.dateDeathRecorded;
    this.sentenceLength = build.sentenceLength;
    this.onCount = build.onCount;
    this.transferDate = build.transferDate;
    this.facilityId = build.facilityId;
  }

  static get Builder() {
    class Builder {
      defaultInmate() {
        this.inmateId = "A0000001";
        this.firstName = "Bob";
        this.lastName = "Loblaw";
        this.region = "OAHU";
        this.facility = "HCF";
        this.locationSub1 = "MODULE 3";
        this.locationSub2 = "UNIT 2";
        this.housing = "HCF";
        this.currentLocation = "HCF";
        this.status = "SENTENCED";
        this.custodyStatus = "PRETRIAL FELON";
        this.securityClassification = "MEDIUM";
        this.gender = "MALE";
        this.primaryEthnicity = "PUERTO RICAN";
        this.race = "WHITE";
        this.muster = "OAHU";
        this.indigent = false;
        this.classificationDate = "2023-01-01";
        this.bookingStartDate = "2023-01-01";
        this.tentativeReleaseDate = "2023-01-10";
        this.bookingEndDate = "2023-01-10";
        this.actualReleaseDate = "2023-01-10";
        this.weekender = false;
        this.dateOfBirth = "2020-01-01";
        this.age = 3;
        this.countryOfBirth = "USA";
        this.citizenship = "USA";
        this.language = "ENGLISH";
        this.sentenceLength = "1 weeks, 3 days";
        this.onCount = true;
        return this;
      }

      withInmateId(inmateId) {
        this.inmateId = inmateId;
        return this;
      }

      withFirstName(firstName) {
        this.firstName = firstName;
        return this;
      }

      withLastName(lastName) {
        this.lastName = lastName;
        return this;
      }

      withRegion(region) {
        this.region = region;
        return this;
      }

      withFacility(facility) {
        this.facility = facility;
        return this;
      }

      withLocationSub1(locationSub1) {
        this.locationSub1 = locationSub1;
        return this;
      }

      withLocationSub2(locationSub2) {
        this.locationSub2 = locationSub2;
        return this;
      }

      withLocationSub3(locationSub3) {
        this.locationSub3 = locationSub3;
        return this;
      }

      withLocationSub4(locationSub4) {
        this.locationSub4 = locationSub4;
        return this;
      }

      withHousing(housing) {
        this.housing = housing;
        return this;
      }

      withCurrentLocation(currentLocation) {
        this.currentLocation = currentLocation;
        return this;
      }

      withStatus(status) {
        this.status = status;
        return this;
      }

      withCustodyStatus(custodyStatus) {
        this.custodyStatus = custodyStatus;
        return this;
      }

      withCustodyStatusReason(custodyStatusReason) {
        this.custodyStatusReason = custodyStatusReason;
        return this;
      }

      withSecurityClassification(securityClassification) {
        this.securityClassification = securityClassification;
        return this;
      }

      withGender(gender) {
        this.gender = gender;
        return this;
      }

      withPrimaryEthnicity(primaryEthnicity) {
        this.primaryEthnicity = primaryEthnicity;
        return this;
      }

      withRace(race) {
        this.race = race;
        return this;
      }

      withMuster(muster) {
        this.muster = muster;
        return this;
      }

      withIndigent(indigent) {
        this.indigent = indigent;
        return this;
      }

      withReleaseType(releaseType) {
        this.releaseType = releaseType;
        return this;
      }

      withClassificationDate(classificationDate) {
        this.classificationDate = classificationDate;
        return this;
      }

      withBookingStartDate(bookingStartDate) {
        this.bookingStartDate = bookingStartDate;
        return this;
      }

      withTentativeReleaseDate(tentativeReleaseDate) {
        this.tentativeReleaseDate = tentativeReleaseDate;
        return this;
      }

      withBookingEndDate(bookingEndDate) {
        this.bookingEndDate = bookingEndDate;
        return this;
      }

      withActualReleaseDate(actualReleaseDate) {
        this.actualReleaseDate = actualReleaseDate;
        return this;
      }

      withWeekender(weekender) {
        this.weekender = weekender;
        return this;
      }

      withDateOfBirth(dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
        return this;
      }

      withAge(age) {
        this.age = age;
        return this;
      }

      withCountryOfBirth(countryOfBirth) {
        this.countryOfBirth = countryOfBirth;
        return this;
      }

      withCitizenship(citizenship) {
        this.citizenship = citizenship;
        return this;
      }

      withReligion(religion) {
        this.religion = religion;
        return this;
      }

      withoutReligion() {
        this.religion = null;
        return this;
      }

      withLanguage(language) {
        this.language = language;
        return this;
      }

      withDateDeathRecorded(dateDeathRecorded) {
        this.dateDeathRecorded = dateDeathRecorded;
        return this;
      }

      withSentenceLength(sentenceLength) {
        this.sentenceLength = sentenceLength;
        return this;
      }

      withOnCount(onCount) {
        this.onCount = onCount;
        return this;
      }

      withTransferDate(transferDate) {
        this.transferDate = transferDate;
        return this;
      }

      withFacilityId(facilityId) {
        this.facilityId = facilityId;
        return this;
      }

      build() {
        return new Inmate(this);
      }
    }

    return Builder;
  }
}

export default Inmate;
