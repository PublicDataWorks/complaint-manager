import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import TagTableRow from "./TagTableRow";
import EditTagDialog from "./EditTagDialog";
import createConfiguredStore from "../../createConfiguredStore";
import { GET_TAGS_SUCCEEDED } from "../../../sharedUtilities/constants";

describe("EditTagDialog", () => {
  test("should render a textbox with an already populated tag name", () => {
    render(
      <Provider store={createConfiguredStore()}>
        <Router>
          <EditTagDialog
            classes={{}}
            tag={{ name: "Mr. Tag", id: 2 }}
            open={true}
          />
        </Router>
      </Provider>
    );
    let cells = screen.getByTestId("editTagCancelButton");
    expect(screen.getByTestId("editTagCancelButton")).toBeInTheDocument;
    expect(screen.getByTestId("editTagTextBox").value).toEqual("Mr. Tag");
  });

  test("should render an error after submit on an already existing tag", () => {
    let store = createConfiguredStore();
    store.dispatch({
      type: GET_TAGS_SUCCEEDED,
      tags: [{ name: "Tofu", id: 3, count: 1 }]
    });
    render(
      <Provider store={store}>
        <Router>
          <EditTagDialog
            classes={{}}
            tag={{ name: "Mr. Tag", id: 2 }}
            open={true}
          />
        </Router>
      </Provider>
    );
    let saveButton = screen.getByTestId("saveTagButton");
    expect(saveButton).toBeInTheDocument;
    userEvent.type(screen.getByTestId("editTagTextBox"), "Tofu");
    userEvent.click(saveButton);
    screen.getByText("The tag name you entered already exists");
  });

//   test("should disable edit button by default", () => {
//     render(
//       <Provider store={createConfiguredStore()}>
//         <Router>
//           <EditTagDialog classes={{}} tag={{ name: "Mr. Tag", id: 2 }} />
//         </Router>
//       </Provider>
//     );
//     let cells = screen.getAllByRole("editTagCancelButton");
//     expect(cells[0].textContent).toEqual("Mr. Tag");
//   });
//   test("should disable edit button when tag already exist", () => {
//     render(
//       <Provider store={createConfiguredStore()}>
//         <Router>
//           <EditTagDialog classes={{}} tag={{ name: "Mr. Tag", id: 2 }} />
//         </Router>
//       </Provider>
//     );
//     let cells = screen.getAllByRole("editTagCancelButton");
//     expect(cells[0].textContent).toEqual("Mr. Tag");
//   });

//   test("should renable edit button when tag isn't blank or doesn't exist", () => {
//     render(
//       <Provider store={createConfiguredStore()}>
//         <Router>
//           <EditTagDialog classes={{}} tag={{ name: "Mr. Tag", id: 2 }} />
//         </Router>
//       </Provider>
//     );

//     let cells = screen.getByTestId("editTagCancelButton");
//     expect(cells[0].textContent).toEqual("Mr. Tag");
//   });
});
