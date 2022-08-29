import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import nock from "nock";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import Signatures from "./Signatures";
import createConfiguredStore from "../../../createConfiguredStore";
import userEvent from "@testing-library/user-event";
import { FAKE_USERS } from "../../../../sharedUtilities/constants";
import SharedSnackbarContainer from "../../shared/components/SharedSnackbarContainer";

jest.mock("../../shared/components/FileUpload");

describe("Signatures Admin Card", () => {
  beforeEach(() => {
    nock.cleanAll();
    nock("http://localhost")
      .get("/api/signers")
      .reply(200, [
        {
          id: 1,
          name: "John A Simms",
          title: "Independent Police Monitor",
          nickname: "jsimms@oipm.gov",
          phone: "888-576-9922",
          links: [
            {
              rel: "signature",
              href: "/api/signers/1/signature"
            },
            {
              rel: "delete",
              href: "/api/signers/1",
              method: "delete"
            }
          ]
        },
        {
          id: 2,
          name: "Nina Ambroise",
          title: "Complaint Intake Specialist",
          nickname: "nambroise@oipm.gov",
          phone: "888-576-9922",
          links: [
            {
              rel: "signature",
              href: "/api/signers/2/signature"
            }
          ]
        }
      ]);

    for (let i = 1; i <= 2; i++) {
      nock("http://localhost")
        .get(`/api/signers/${i}/signature`)
        .reply(200, "bytes");
    }

    render(
      <Provider store={createConfiguredStore()}>
        <Router>
          <Signatures />
          <SharedSnackbarContainer />
        </Router>
      </Provider>
    );
  });

  test("should render title and signers", async () => {
    expect(screen.getByText("Signatures")).toBeInTheDocument;
    expect(await screen.findByText("John A Simms")).toBeInTheDocument;
    expect(await screen.findByText("Nina Ambroise")).toBeInTheDocument;
    expect(await screen.findAllByText("888-576-9922")).toBeInTheDocument;
    expect(await screen.findByText("Complaint Intake Specialist"))
      .toBeInTheDocument;
    expect(await screen.findByAltText("The signature of Nina Ambroise"))
      .toBeInTheDocument;
  });

  describe("Add Signer Dialog", () => {
    let saveButton;
    beforeEach(async () => {
      nock("http://localhost").get("/api/users").reply(200, FAKE_USERS);
      userEvent.click(screen.getByText("+ Add Signature"));
      saveButton = await screen.findByText("Save");
    });

    test("should open add signer dialog when add signer button is clicked and close on cancel", async () => {
      userEvent.click(await screen.findByText("Cancel"));
      expect(screen.queryAllByText("Save")).toHaveLength(0);
      expect(screen.getByText("+ Add Signature")).toBeInTheDocument;
    });

    test("should reject form submission if not all fields are populated", () => {
      userEvent.click(saveButton);
      expect(screen.getByText("Please enter Username")).toBeInTheDocument;
      expect(screen.getByText("Please enter Name")).toBeInTheDocument;
      expect(screen.getByText("Please enter Role")).toBeInTheDocument;
      expect(screen.getByText("Please enter Phone Number")).toBeInTheDocument;

      userEvent.type(screen.getByPlaceholderText("Name"), "Candy");
      userEvent.type(screen.getByPlaceholderText("Phone number"), "7777777777");
      userEvent.click(screen.getByText("Save"));
      expect(screen.getByText("Please enter Username")).toBeInTheDocument;
      expect(screen.queryAllByText("Please enter Name")).toHaveLength(0);
      expect(screen.getByText("Please enter Role")).toBeInTheDocument;
      expect(screen.queryAllByText("Please enter Phone Number")).toHaveLength(
        0
      );
    });

    test("should reject form submission if phone number is not a phone number", () => {
      fireEvent.change(screen.getByPlaceholderText("Select a user"), {
        target: { value: FAKE_USERS[0].email }
      });
      userEvent.type(screen.getByPlaceholderText("Name"), "Candy");
      userEvent.type(
        screen.getByPlaceholderText("Phone number"),
        "not a phone number"
      );
      userEvent.type(
        screen.getByPlaceholderText("Role/title"),
        "Chief Executive Police Punisher"
      );

      userEvent.click(saveButton);
      expect(screen.getByText("Please enter a numeric 10 digit value"))
        .toBeInTheDocument;
    });

    test("should make service calls and close the dialog when saved correctly", async () => {
      const signerPost = nock("http://localhost")
        .post("/api/signers")
        .reply(200, {
          id: 3,
          name: "Candy",
          title: "Chief Executive Police Punisher",
          nickname: "anna.banana@gmail.com",
          phone: "777-777-7777",
          links: [
            {
              rel: "signature",
              href: "/api/signers/3/signature"
            }
          ]
        });

      nock("http://localhost")
        .get("/api/signers")
        .reply(200, [
          {
            id: 1,
            name: "John A Simms",
            title: "Independent Police Monitor",
            nickname: "jsimms@oipm.gov",
            phone: "888-576-9922",
            links: [
              {
                rel: "signature",
                href: "/api/signers/1/signature"
              }
            ]
          },
          {
            id: 2,
            name: "Nina Ambroise",
            title: "Complaint Intake Specialist",
            nickname: "nambroise@oipm.gov",
            phone: "888-576-9922",
            links: [
              {
                rel: "signature",
                href: "/api/signers/2/signature"
              }
            ]
          },
          {
            id: 3,
            name: "Candy",
            title: "Chief Executive Police Punisher",
            nickname: FAKE_USERS[0].email,
            phone: "777-777-7777",
            links: [
              {
                rel: "signature",
                href: "/api/signers/3/signature"
              }
            ]
          }
        ]);

      userEvent.click(screen.getByPlaceholderText("Select a user"));
      userEvent.click(await screen.findByText(FAKE_USERS[0].email));
      userEvent.type(screen.getByPlaceholderText("Name"), "Candy");
      userEvent.type(
        screen.getByPlaceholderText("Phone number"),
        "777-777-7777"
      );
      userEvent.type(
        screen.getByPlaceholderText("Role/title"),
        "Chief Executive Police Punisher"
      );

      userEvent.click(saveButton);
      await Promise.all([
        new Promise(resolve => {
          signerPost.on("replied", () => {
            resolve();
          });
        })
      ]);
      expect(signerPost.isDone()).toBeTrue();
    });
  });

  describe("Edit Signer Dialog", () => {
    let saveButton;
    beforeEach(async () => {
      nock("http://localhost").get("/api/users").reply(200, FAKE_USERS);
      const editButtons = await screen.findAllByText("Edit");
      userEvent.click(editButtons[0]);
      saveButton = await screen.findByText("Save");
    });

    test("should open edit signer dialog when edit signer button is clicked and close on cancel", async () => {
      userEvent.click(await screen.findByText("Cancel"));
      expect(screen.queryAllByText("Save")).toHaveLength(0);
      expect(screen.getAllByText("Edit")).toHaveLength(2);
    });

    test("should auto-populate fields with previous values", async () => {
      expect(screen.getByTestId("user").value).toEqual("jsimms@oipm.gov");
      expect(screen.getByTestId("user").disabled).toBeTrue();
      expect(screen.getByTestId("signerName").value).toEqual("John A Simms");
      expect(screen.getByTestId("role").value).toEqual(
        "Independent Police Monitor"
      );
      expect(screen.getByTestId("phoneNumber").value).toEqual("888-576-9922");
    });

    test("should make service calls and close the dialog when saved correctly", async () => {
      const signerPut = nock("http://localhost")
        .put("/api/signers/1")
        .reply(200, {
          id: 1,
          name: "Candy",
          title: "Chief Executive Police Punisher",
          nickname: "jsimms@oipm.gov",
          phone: "777-777-7777",
          links: [
            {
              rel: "signature",
              href: "/api/signers/1/signature"
            }
          ]
        });

      nock("http://localhost")
        .get("/api/signers")
        .reply(200, [
          {
            id: 1,
            name: "Candy",
            title: "Chief Executive Police Punisher",
            nickname: FAKE_USERS[0].email,
            phone: "777-777-7777",
            links: [
              {
                rel: "signature",
                href: "/api/signers/1/signature"
              }
            ]
          },
          {
            id: 2,
            name: "Nina Ambroise",
            title: "Complaint Intake Specialist",
            nickname: "nambroise@oipm.gov",
            phone: "888-576-9922",
            links: [
              {
                rel: "signature",
                href: "/api/signers/2/signature"
              }
            ]
          }
        ]);

      fireEvent.change(screen.getByPlaceholderText("Name"), {
        target: { value: "Candy" }
      });
      fireEvent.change(screen.getByPlaceholderText("Phone number"), {
        target: { value: "777-777-7777" }
      });
      fireEvent.change(screen.getByPlaceholderText("Role/title"), {
        target: { value: "Chief Executive Police Punisher" }
      });

      userEvent.click(saveButton);
      await new Promise(resolve => {
        signerPut.on("replied", () => {
          resolve();
        });
      });
      expect(signerPut.isDone()).toBeTrue();
    });
  });

  describe("Delete Signer Dialog", () => {
    let saveButton;
    beforeEach(async () => {
      nock("http://localhost").get("/api/users").reply(200, FAKE_USERS);
      const removeButtons = await screen.findAllByText("Remove");
      userEvent.click(removeButtons[0]);
      saveButton = await screen.findByText("Delete");
    });

    test("should have disabled 'remove' button if there is no delete link for the given signer", async () => {
      userEvent.click(await screen.findByText("Cancel"));
      expect(screen.getAllByTestId("remove-button")[1].disabled).toBeTrue();
    });

    test("should open remove signer dialog when remove signer button is clicked and close on cancel", async () => {
      userEvent.click(await screen.findByText("Cancel"));
      expect(screen.queryAllByText("Delete")).toHaveLength(0);
      expect(screen.getAllByText("Remove")).toHaveLength(2);
    });

    test("should make service calls and close the dialog when deleted correctly and see snackbar message", async () => {
      const signerDelete = nock("http://localhost")
        .delete("/api/signers/1")
        .reply(200, {});

      nock("http://localhost")
        .get("/api/signers")
        .reply(200, [
          {
            id: 2,
            name: "Nina Ambroise",
            title: "Complaint Intake Specialist",
            nickname: "nambroise@oipm.gov",
            phone: "888-576-9922",
            links: [
              {
                rel: "signature",
                href: "/api/signers/2/signature"
              }
            ]
          }
        ]);

      userEvent.click(saveButton);
      await new Promise(resolve => {
        signerDelete.on("replied", () => {
          resolve();
        });
      });
      expect(signerDelete.isDone()).toBeTrue();
      expect(await screen.findByText("Signer successfully deleted"))
        .toBeInTheDocument;
    });
  });
});
