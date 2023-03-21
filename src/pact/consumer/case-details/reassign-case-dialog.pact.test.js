import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { pactWith } from "jest-pact";
import { eachLike, like } from "@pact-foundation/pact/src/dsl/matchers";
import createConfiguredStore from "../../../client/createConfiguredStore";
import RecommendedActions from "../../../client/policeDataManager/cases/ReferralLetter/RecommendedActions/RecommendedActions";
import SharedSnackbarContainer from "../../../client/policeDataManager/shared/components/SharedSnackbarContainer";
import ReassignCaseDialog from "../../../client/policeDataManager/cases/CaseDetails/ReassignCaseDialog/ReassignCaseDialog";
import {
  FAKE_USERS,
  GET_USERS_SUCCESS
} from "../../../sharedUtilities/constants";
import { setUpCaseDetailsPage } from "./case-details-helper";

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

    describe("Reassign Case Dialog", () => {
      beforeEach(async () => {
        setUpCaseDetailsPage(provider);
        userEvent.click(await screen.findByTestId("assignedToButton"));
      });

      test("should reassign assignedTo", async () => {
        await provider.addInteraction({
          state: "Case exists",
          uponReceiving: "Update Assigned To",
          withRequest: {
            method: "PUT",
            path: "/api/cases/1",
            headers: {
              "Content-Type": "application/json"
            },
            body: like({
              nextStatus: "Forwarded to Agency",
              caseReferencePrefix: "AC",
              caseReference: "AC2022-0001",
              id: 1,
              complaintType: "Civilian Initiated",
              status: "Ready for Review",
              year: 2022,
              caseNumber: 1,
              firstContactDate: "2022-08-22",
              intakeSourceId: 3,
              createdBy: "noipm.infrastructure@gmail.com",
              assignedTo: "anna.banana@gmail.com",
              createdAt: "2022-08-22T15:55:45.879Z",
              updatedAt: "2022-08-22T15:56:27.641Z",
              intakeSource: {
                id: 3,
                name: "In Person",
                createdAt: "2022-08-19T16:45:01.760Z",
                updatedAt: "2022-08-19T16:45:01.760Z"
              },
              complainantCivilians: [],
              witnessCivilians: [],
              complainantInmates: [],
              complainantOfficers: [],
              attachments: [],
              accusedOfficers: [],
              witnessOfficers: [],
              pdfAvailable: false,
              isArchived: false
            })
          },
          willRespondWith: {
            status: 200
          }
        });

        userEvent.click(screen.getByTestId("userDropdownInput"));
        const newAssignee = await screen.findByText("Anna Banana");
        userEvent.click(newAssignee);
        userEvent.click(screen.getByTestId("assignedToSubmitButton"));

        const snackbar = await screen.findByTestId("sharedSnackbarBannerText");
        expect(snackbar.textContent).toInclude("successfully updated");
      });
    });
  }
);
