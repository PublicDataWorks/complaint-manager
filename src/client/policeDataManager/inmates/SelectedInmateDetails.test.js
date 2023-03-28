import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import nock from "nock";
import createConfiguredStore from "../../createConfiguredStore";
import SharedSnackbarContainer from "../shared/components/SharedSnackbarContainer";
import SelectedInmateDetails from "./SelectedInmateDetails";
import { getCaseDetailsSuccess } from "../actionCreators/casesActionCreators";
import { push } from "connected-react-router";

describe("Selected Inmate Details", () => {
  let store, dispatchSpy;

  beforeEach(() => {
    store = createConfiguredStore();
    dispatchSpy = jest.spyOn(store, "dispatch");

    store.dispatch(
      getCaseDetailsSuccess({
        primaryComplainant: {
          fullName: "",
          id: 1,
          inmateId: "A6084745",
          roleOnCase: "Complainant",
          isAnonymous: false,
          caseId: 1,
          inmate: {
            fullName: "Robin Archuleta",
            inmateId: "A6084745",
            firstName: "Robin",
            lastName: "Archuleta",
            region: "HAWAII",
            facility: "WCCC",
            facilityId: 6
          }
        },
        caseReferencePrefix: "PiC",
        caseReference: "PiC2023-0001",
        id: 1,
        complainantInmates: [
          {
            fullName: "",
            id: 1,
            inmateId: "A6084745",
            roleOnCase: "Complainant",
            isAnonymous: false,
            caseId: 1,
            inmate: {
              fullName: "Robin Archuleta",
              inmateId: "A6084745",
              firstName: "Robin",
              lastName: "Archuleta",
              region: "HAWAII",
              facility: "WCCC",
              facilityId: 6
            }
          }
        ],
        witnessInmates: [],
        accusedInmates: []
      })
    );

    render(
      <Provider store={store}>
        <Router>
          <SelectedInmateDetails
            match={{ params: { id: "1", caseInmateId: "1" } }}
          />
          <SharedSnackbarContainer />
        </Router>
      </Provider>
    );
  });

  test("should render the selected inmate display and form", async () => {
    expect(screen.getByText("Selected Person in Custody"));
    expect(await screen.findByText("Additional Info"));
  });

  test("should successfully submit and redirect when anonymize checkbox is clicked and notes are added", async () => {
    const putNock = nock("http://localhost")
      .put("/api/cases/1/inmates/1", {
        isAnonymous: true,
        notes: "this PiC is OK"
      })
      .reply(200);

    userEvent.click(screen.getByTestId("isInmateAnonymous"));
    userEvent.type(screen.getByTestId("notesField"), "this PiC is OK");
    userEvent.click(screen.getByTestId("inmate-submit-button"));

    expect(
      await screen.findByText("Person in Custody Successfully Added to Case")
    );
    expect(putNock.isDone()).toBeTrue();
    expect(dispatchSpy).toHaveBeenCalledWith(push("/cases/1"));
  });
});
