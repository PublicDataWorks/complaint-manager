import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { pactWith } from "jest-pact";
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
import { ADD_CASE_EMPLOYEE_TYPE } from "../../../sharedUtilities/constants";

jest.mock(
  "../../../client/policeDataManager/cases/CaseDetails/PersonOnCaseDialog/MapServices/MapService",
  () => {
    return jest.fn().mockImplementation(() => ({
      healthCheck: callback => {
        callback({ googleAddressServiceIsAvailable: false });
      }
    }));
  }
);

const scenarios = [
  {
    role: "Complainant",
    buttonIndex: 0,
    buttonTestId: "addPersonOnCase",
    method: "POST",
    options: [],
    title: "Officer"
  },
  {
    role: "Witness",
    buttonIndex: 1,
    buttonTestId: "addPersonOnCase",
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
    buttonTestId: "addPersonOnCase",
    method: "POST",
    options: [],
    title: "Employed Person"
  },
  {
    role: "Witness",
    buttonIndex: 1,
    buttonTestId: "addPersonOnCase",
    method: "POST",
    options: [],
    title: "Employed Person"
  },
  {
    role: "Accused",
    buttonIndex: 0,
    buttonTestId: "addAccusedMenu",
    method: "POST",
    options: [],
    title: "Employed Person"
  },
  {
    role: "Complainant",
    buttonIndex: 0,
    buttonTestId: "editOfficerLink",
    method: "PUT",
    options: [NOPD_COMPLAINANT],
    title: "Employed Person"
  },
  {
    role: "Witness",
    buttonIndex: 0,
    buttonTestId: "editOfficerLink",
    method: "PUT",
    options: [NOPD_WITNESS],
    title: "Employed Person"
  },
  {
    role: "Accused",
    buttonIndex: 0,
    buttonTestId: "manageCaseOfficer",
    method: "PUT",
    options: [NOPD_ACCUSED],
    title: "Employed Person"
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
          jest.setTimeout(500000);
          let dispatchSpy;
          beforeEach(async () => {
            console.warn = () => {};
            const results = await setUpCaseDetailsPage(provider, ...options);
            dispatchSpy = results.dispatchSpy;
            const complainantDialogButton = await screen.findAllByTestId(
              "addPersonOnCase"
            );

            userEvent.click(complainantDialogButton[0]);
            userEvent.click(await screen.findByText("Civilian Complainant"));
            userEvent.click(await screen.findByTestId("cancelEditCivilian"));
          });

          if (method === "POST") {
            test(`should add a ${title} ${role}`, async () => {
              jest.setTimeout(700000);
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
              if (title === "Employed Person") {
                if (role === "Witness" || role === "Complainant") {
                  userEvent.click(
                    await screen.findByTestId("addNon-OfficerPersonOnCase")
                  );
                }
                if (role === "Accused") {
                  userEvent.click(
                    await screen.findByTestId("addAccusedNon-Officer")
                  );
                }
              }

              if (title === "Employed Person") {
                expect(
                  dispatchSpy.mock.calls.find(
                    call => call[0].type === ADD_CASE_EMPLOYEE_TYPE
                  )[0]
                ).toEqual(addCaseEmployeeType("Non-Officer"));
              }
              if (title === "Officer") {
                expect(
                  dispatchSpy.mock.calls.find(
                    call => call[0].type === ADD_CASE_EMPLOYEE_TYPE
                  )[0]
                ).toEqual(addCaseEmployeeType("Officer"));
              }
              expect(
                dispatchSpy.mock.calls.find(
                  call => call[0].type === "@@router/CALL_HISTORY_METHOD"
                )[0]
              ).toEqual(push("/cases/1/officers/search"));
            }, 200000);
          }

          if (method === "PUT") {
            test(`should edit a ${title} ${role}`, async () => {
              jest.setTimeout(700000);
              let state = "Case exists";
              if (
                options.includes(OFFICER_COMPLAINANT) ||
                options.includes(NOPD_COMPLAINANT)
              ) {
                state += ": with officer complainant";
              }
              if (
                options.includes(OFFICER_WITNESS) ||
                options.includes(NOPD_WITNESS)
              ) {
                state += ": with officer witness";
              }
              if (
                options.includes(OFFICER_ACCUSED) ||
                options.includes(NOPD_ACCUSED)
              ) {
                state += ": case has accused officer with allegations";
              }

              const buttons = await screen.findAllByTestId(buttonTestId);

              userEvent.click(buttons[buttonIndex]);
              if (title === "Officer" && role === "Accused") {
                userEvent.click(await screen.findByText(`Edit ${title}`));
              }
              if (title === "Employed Person" && role === "Accused") {
                userEvent.click(await screen.findByTestId("editCaseOfficer"));
              }

              if (title === "Employed Person") {
                expect(dispatchSpy).toHaveBeenCalledWith(
                  addCaseEmployeeType("Non-Officer")
                );
              }
              if (title === "Officer") {
                expect(dispatchSpy).toHaveBeenCalledWith(
                  addCaseEmployeeType("Officer")
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
