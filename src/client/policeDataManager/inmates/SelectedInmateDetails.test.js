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
import { selectInmate } from "../actionCreators/inmateActionCreators";
import { COMPLAINANT } from "../../../sharedUtilities/constants";

describe("Selected Inmate Details", () => {
  let store, dispatchSpy;

  beforeEach(() => {
    store = createConfiguredStore();
    dispatchSpy = jest.spyOn(store, "dispatch");

    store.dispatch(
      selectInmate(
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
        },
        COMPLAINANT
      )
    );

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
        complainantInmates: [],
        witnessInmates: [],
        accusedInmates: []
      })
    );

    render(
      <Provider store={store}>
        <Router>
          <SelectedInmateDetails
            match={{ params: { id: "1", roleOnCase: COMPLAINANT } }}
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

  test("should successfully add inmate to case and redirect when submitted", async () => {
    const postNock = nock("http://localhost")
      .post("/api/cases/1/inmates", {
        isAnonymous: true,
        notes: "this PiC is OK",
        inmateId: "A6084745",
        roleOnCase: COMPLAINANT
      })
      .reply(200);

    userEvent.click(screen.getByTestId("isInmateAnonymous"));
    userEvent.type(screen.getByTestId("notesField"), "this PiC is OK");
    userEvent.click(screen.getByTestId("inmate-submit-button"));

    expect(
      await screen.findByText("Person in Custody Successfully Added to Case")
    );
    expect(postNock.isDone()).toBeTrue();
    expect(dispatchSpy).toHaveBeenCalledWith(push("/cases/1"));
  });
});
