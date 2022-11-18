import { findByTestId, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { pactWith } from "jest-pact";
import { like } from "@pact-foundation/pact/src/dsl/matchers";
import {
  OFFICER_COMPLAINANT,
  OFFICER_WITNESS,
  OFFICER_ACCUSED,
  NOPD_COMPLAINANT,
  NOPD_WITNESS,
  NOPD_ACCUSED,
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
    options: [],
    title: "Officer"
  },
  {
    role: "Witness",
    buttonIndex: 1,
    buttonTestId: "addComplainantWitness",
    method: "POST",
    options: [],
    title: "Officer"
  },
  {
    role: "Accused",
    buttonIndex: 0,
    buttonTestId: "addAccusedMenu",
    method: "POST",
    options: [],
    title: "Officer"
  },
  {
    role: "Complainant",
    buttonIndex: 0,
    buttonTestId: "editOfficerLink",
    method: "PUT",
    options: [OFFICER_COMPLAINANT],
    title: "Officer"
  },
  {
    role: "Witness",
    buttonIndex: 0,
    buttonTestId: "editOfficerLink",
    method: "PUT",
    options: [OFFICER_WITNESS],
    title: "Officer"
  },
  {
    role: "Accused",
    buttonIndex: 0,
    buttonTestId: "manageCaseOfficer",
    method: "PUT",
    options: [OFFICER_ACCUSED],
    title: "Officer"
  },
  {
    role: "Complainant",
    buttonIndex: 0,
    buttonTestId: "addComplainantWitness",
    method: "POST",
    options: [],
    title: "Civilian (NOPD)"
  },
  {
    role: "Witness",
    buttonIndex: 1,
    buttonTestId: "addComplainantWitness",
    method: "POST",
    options: [],
    title: "Civilian (NOPD)"
  },
  {
    role: "Accused",
    buttonIndex: 0,
    buttonTestId: "addAccusedMenu",
    method: "POST",
    options: [],
    title: "Civilian (NOPD)"
  },
  {
    role: "Complainant",
    buttonIndex: 0,
    buttonTestId: "editOfficerLink",
    method: "PUT",
    options: [NOPD_COMPLAINANT],
    title: "Civilian (NOPD)"
  },
  {
    role: "Witness",
    buttonIndex: 0,
    buttonTestId: "editOfficerLink",
    method: "PUT",
    options: [NOPD_WITNESS],
    title: "Civilian (NOPD)"
  },
  {
    role: "Accused",
    buttonIndex: 0,
    buttonTestId: "manageCaseOfficer",
    method: "PUT",
    options: [NOPD_ACCUSED],
    title: "Civilian (NOPD)"
  }
];

scenarios.forEach(
  ({ role, buttonIndex, buttonTestId, method, options, title }) => {
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

        describe(`add/edit ${title} ${role}`, () => {
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
            test(`should add a ${title} ${role}`, async () => {
              let state = "Case exists";

              const buttons = await screen.findAllByTestId(buttonTestId);

              userEvent.click(buttons[buttonIndex]);
              if (title === "Officer") {
                if (role === "Witness" || role === "Complainant") {
                  userEvent.click(await screen.findByText(`${title} ${role}`));
                }
                if (role === "Accused") {
                  userEvent.click(await screen.findByText(`Accused ${title}`));
                }
              }
              if (title === "Civilian (NOPD)") {
                if (role === "Witness" || role === "Complainant") {
                  userEvent.click(
                    await screen.findByTestId(
                      "addCivilianWithinPdComplainantWitness"
                    )
                  );
                }
                if (role === "Accused") {
                  userEvent.click(
                    await screen.findByTestId("addAccusedCivilianWithinPD")
                  );
                }
              }

              if (title === "Civilian (NOPD") {
                expect(dispatchSpy).toHaveBeenCalledWith(
                  addCaseEmployeeType(
                    PERSON_TYPE.CIVILIAN_WITHIN_PD.employeeDescription
                  )
                );
              }
              if (title === "Officer") {
                expect(dispatchSpy).toHaveBeenCalledWith(
                  addCaseEmployeeType(
                    PERSON_TYPE.KNOWN_OFFICER.employeeDescription
                  )
                );
              }
              expect(dispatchSpy).toHaveBeenCalledWith(
                push("/cases/1/officers/search")
              );
            }, 200000);
          }
          if (method === "PUT") {
            test(`should edit a ${title} ${role}`, async () => {
              let state = "Case exists";
              if (
                (method === "PUT" && options.includes(OFFICER_COMPLAINANT)) ||
                options.includes(NOPD_COMPLAINANT)
              ) {
                state += ": with officer complainant";
              }
              if (
                (method === "PUT" && options.includes(OFFICER_WITNESS)) ||
                options.includes(NOPD_WITNESS)
              ) {
                state += ": with officer witness";
              }
              if (
                (method === "PUT" && options.includes(OFFICER_ACCUSED)) ||
                options.includes(NOPD_ACCUSED)
              ) {
                state += ": case has accused officer with allegations";
              }

              const buttons = await screen.findAllByTestId(buttonTestId);

              userEvent.click(buttons[buttonIndex]);
              if (
                title === "Officer" &&
                role === "Accused" &&
                method === "PUT"
              ) {
                userEvent.click(await screen.findByText(`Edit ${title}`));
              }
              if (
                title === "Civilian (NOPD)" &&
                role === "Accused" &&
                method === "PUT"
              ) {
                userEvent.click(await screen.findByTestId("editCaseOfficer"));
              }

              if (title === "Civilian (NOPD") {
                expect(dispatchSpy).toHaveBeenCalledWith(
                  addCaseEmployeeType(
                    PERSON_TYPE.CIVILIAN_WITHIN_PD.employeeDescription
                  )
                );
              }
              if (title === "Officer") {
                expect(dispatchSpy).toHaveBeenCalledWith(
                  addCaseEmployeeType(
                    PERSON_TYPE.KNOWN_OFFICER.employeeDescription
                  )
                );
              }

              expect(dispatchSpy).toHaveBeenCalledWith(
                push("/cases/1/officers/1")
              );
            }, 200000);
          }
        });
      }
    );
  }
);
