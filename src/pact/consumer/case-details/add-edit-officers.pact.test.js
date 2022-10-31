import { findByTestId, screen } from "@testing-library/react";
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
import { addCaseEmployeeType } from "../../../client/policeDataManager/actionCreators/officersActionCreators";
import { push } from "connected-react-router";

const {
  PERSON_TYPE
} = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/constants`);

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
    options: []
  },
  {
    role: "Witness",
    buttonIndex: 1,
    buttonTestId: "addComplainantWitness",
    method: "POST",
    options: []
  },
  {
    role: "Accused",
    buttonIndex: 0,
    buttonTestId: "addAccusedMenu",
    method: "POST",
    options: []
  },
  {
    role: "Complainant",
    buttonIndex: 0,
    buttonTestId: "editOfficerLink",
    method: "PUT",
    options: [OFFICER_COMPLAINANT]
  },
  {
    role: "Witness",
    buttonIndex: 0,
    buttonTestId: "editOfficerLink",
    method: "PUT",
    options: [OFFICER_WITNESS]
  },
  {
    role: "Accused",
    buttonIndex: 0,
    buttonTestId: "manageCaseOfficer",
    method: "PUT",
    options: [OFFICER_ACCUSED]
  }
];

scenarios.forEach(({ role, buttonIndex, buttonTestId, method, options }) => {
  pactWith(
    {
      consumer: "complaint-manager.client",
      provider: "complaint-manager.server",
      logLevel: "ERROR",
      timeout: 500000
    },
    provider => {
      beforeAll(async () => {
        axios.defaults.baseURL = provider.mockService.baseUrl;
      });

      describe(`add/edit officer ${role}`, () => {
        let dispatchSpy;
        beforeEach(async () => {
          dispatchSpy = await setUpCaseDetailsPage(provider, ...options);
          const complainantDialogButton = await screen.findAllByTestId(
            "addComplainantWitness"
          );

          userEvent.click(complainantDialogButton[0]);
          userEvent.click(await screen.findByText("Civilian Complainant"));
          userEvent.click(await screen.findByTestId("cancelEditCivilian"));
        });

        if (method === "POST") {
          test(`should add an officer ${role}`, async () => {
            let state = "Case exists";

            const buttons = await screen.findAllByTestId(buttonTestId);

            userEvent.click(buttons[buttonIndex]);
            if (role === "Witness" || role === "Complainant") {
              userEvent.click(await screen.findByText(`Officer ${role}`));
            }
            if (role === "Accused") {
              userEvent.click(await screen.findByText("Accused Officer"));
            }

            expect(dispatchSpy).toHaveBeenCalledWith(
              addCaseEmployeeType(PERSON_TYPE.KNOWN_OFFICER.employeeDescription)
            );
            expect(dispatchSpy).toHaveBeenCalledWith(
              push("/cases/1/officers/search")
            );
          }, 200000);
        }
        if (method === "PUT") {
          test(`should edit an officer ${role}`, async () => {
            let state = "Case exists";
            if (method === "PUT" && options.includes(OFFICER_COMPLAINANT)) {
              state += ": with officer complainant";
            }
            if (method === "PUT" && options.includes(OFFICER_WITNESS)) {
              state += ": with officer witness";
            }
            if (method === "PUT" && options.includes(OFFICER_ACCUSED)) {
              state += ": case has accused officer with allegations";
            }

            const buttons = await screen.findAllByTestId(buttonTestId);

            userEvent.click(buttons[buttonIndex]);
            if (role === "Accused" && method === "PUT") {
              userEvent.click(await screen.findByText("Edit Officer"));
            }

            expect(dispatchSpy).toHaveBeenCalledWith(
              addCaseEmployeeType(PERSON_TYPE.KNOWN_OFFICER.employeeDescription)
            );

            expect(dispatchSpy).toHaveBeenCalledWith(
              push("/cases/1/officers/1")
            );
          }, 200000);
        }
      });
    }
  );
});
