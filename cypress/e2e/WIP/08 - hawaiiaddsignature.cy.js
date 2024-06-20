/// <reference types="cypress"/>
it("HAWAII", () => {
  cy.origin("https://dev-68895481.okta.com", () => {
    cy.visit("https://hcsoc-ci-b16ff838b089.herokuapp.com/");
    cy.wait(2000);
    cy.get("#input28").type("pdm@publicdata.works");
    cy.get("#input36").type("wnc3ubf-hqf-rcr1ZPH");
    cy.get(".button").click();
  });

  cy.wait(4000);

  cy.origin("https://hcsoc-ci-b16ff838b089.herokuapp.com/", () => {
    Cypress.require("../../support/commands.js");
    cy.visit("https://hcsoc-ci-b16ff838b089.herokuapp.com/");
    cy.get(
      '.MuiIconButton-label > :nth-child(1) > [data-testid="tooltip-CM"]'
    ).click();
    cy.get('[data-testid="admin"]').first().click();
    cy.get('[data-testid="pageTitle"]').contains("Admin Portal");
    cy.url().should(
      "eq",
      "https://hcsoc-ci-b16ff838b089.herokuapp.com/admin-portal"
    );

    cy.get(
      '.MuiIconButton-label > :nth-child(1) > [data-testid="tooltip-CM"]'
    ).click();
    cy.get('[data-testid="admin"]').first().click();
    cy.get('[data-testid="addSignature"]').click();

    // Add user info
    cy.get('[data-testid="user"]').type("pdm{downarrow}{enter}");
    cy.get('[data-testid="signerName"]').type("Test");
    cy.get('[data-testid="role"]').type("QA");
    cy.get('[data-testid="phoneNumber"]').type("1231231234");

    // Upload a file to the drag-n-drop area
    cy.get(".filepicker").attachFile("dog_nose.jpg", {
      subjectType: "drag-n-drop"
    });

    cy.wait(2000);

    cy.get('[data-testid="saveButton"]').click();
  });
});
