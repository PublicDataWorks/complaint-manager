import Civilian from "./civilian";
import RaceEthnicity from "./raceEthnicity";
import { COMPLAINANT } from "../../../sharedUtilities/constants";

class ComplainantLetter {
  constructor(build) {
    this.id = build.id;
    this.finalPdfFilename = build.finalPdfFilename;
    this.createdAt = build.createdAt;
    this.updatedAt = build.updatedAt;
    this.caseId = build.caseId;
    this.complainantCivilianId = build.complainantCivilianId;
    this.complainantOfficerId = build.complainantOfficerId;
  }

  static get Builder() {
    const raceEthnicity = new RaceEthnicity.Builder()
      .defaultRaceEthnicity()
      .build();
    class Builder {
      defaultComplainantLetter() {
        const id = 18;
        const finalPdfFilename = "test_pdf_filename.pdf";
        const complainantCivilian = {
          ...new Civilian.Builder()
            .defaultCivilian()
            .withId(24)
            .withRaceEthnicityId(raceEthnicity.id)
            .withRoleOnCase(COMPLAINANT)
            .build(),
          raceEthnicity
        };

        this.id = id;
        this.complainantCivilianId = complainantCivilian.id;
        this.finalPdfFilename = finalPdfFilename;
        this.createdAt = "2015-09-13T05:00:00.000Z";
        this.updatedAt = "2015-09-13T05:00:00.000Z";
        this.caseId = 17;
        this.complainantOfficerId = null;
        return this;
      }

      withId(id) {
        this.id = id;
        return this;
      }

      withFinalPdfFilename(finalPdfFilename) {
        this.finalPdfFilename = finalPdfFilename;
        return this;
      }

      withCaseId(caseId) {
        this.caseId = caseId;
        return this;
      }

      withComplainantCivilianId(complainantCivilianId) {
        this.complainantCivilianId = complainantCivilianId;
        return this;
      }

      withComplainantOfficerId(complainantOfficerId) {
        this.complainantOfficerId = complainantOfficerId;
        return this;
      }
    }

    return Builder;
  }
}

export default ComplainantLetter;
