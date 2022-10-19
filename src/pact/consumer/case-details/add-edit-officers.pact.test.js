import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { pactWith } from "jest-pact";
import { like } from "@pact-foundation/pact/src/dsl/matchers";
import {
  OFFICER_COMPLAINANT,
  OFFICER_WITNESS,
  OFFICER_ACCUSED,
  setUpCaseDetailsPage
} from "./case-details-helper";

jest.mock(
  "../../../client/policeDataManager/cases/CaseDetails/CivilianDialog/MapServices/MapService",
  () => {
    return jest.fn().mockImplementation(() => ({
      healthCheck: callback => {
        callback({ googleAddressServiceIsAvailable: false });
      }
    }));
  }
);

jest.setTimeout(500000);
const scenarios = [
  {
    role: "Complainant",
    buttonIndex: 0,
    buttonTestId: "addComplainantWitness",
    method: "POST",
    endpoint: "",
    successMessage: "Officer was successfully added",
    options: []
  },
  {
    role: "Witness",
    buttonIndex: 1,
    buttonTestId: "addComplainantWitness",
    method: "POST",
    endpoint: "",
    successMessage: "Civilian was successfully created",
    options: []
  },
  {
    role: "Accused",
    buttonIndex: 0,
    buttonTestId: "addAccusedMenu",
    method: "POST",
    endpoint: "",
    successMessage: "Officer was successfully added",
    options: []
  },
  {
    role: "Complainant",
    buttonIndex: 0,
    buttonTestId: "editComplainantLink",
    method: "PUT",
    endpoint: "/1",
    successMessage: "Civilian was successfully updated",
    options: [CIVILIAN_COMPLAINANT]
  },
  {
    role: "Witness",
    buttonIndex: 0,
    buttonTestId: "editComplainantLink",
    method: "PUT",
    endpoint: "/2",
    successMessage: "Civilian was successfully updated",
    options: [CIVILIAN_WITNESS]
  },
  {
    role: "Accused",
    buttonIndex: 0,
    buttonTestId: "editComplainantLink",
    method: "PUT",
    endpoint: "/2",
    successMessage: "Civilian was successfully updated",
    options: [CIVILIAN_WITNESS]
  }
];
