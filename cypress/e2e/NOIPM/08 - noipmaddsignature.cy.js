import "cypress-file-upload";

Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false;
  });

/// <reference types="cypress"/>
it("NOIPM", () => {
  cy.origin("https://noipm-ci.auth0.com", () => {
    cy.visit("https://noipm-ci.herokuapp.com");
    cy.get(
      ".auth0-lock-input-email > .auth0-lock-input-wrap > .auth0-lock-input"
    ).type("vwong@thoughtworks.com");
    cy.get(
      ".auth0-lock-input-show-password > .auth0-lock-input-block > .auth0-lock-input-wrap > .auth0-lock-input"
    ).type("Vwong123");
    cy.get(".auth0-lock-submit").click();
  });

    cy.origin('https://noipm-staging.auth0.com', () => {
    cy.visit('https://noipm-staging.herokuapp.com')    
    cy.get('.auth0-lock-input-email > .auth0-lock-input-wrap > .auth0-lock-input').type('vwong@thoughtworks.com')
    cy.get('.auth0-lock-input-show-password > .auth0-lock-input-block > .auth0-lock-input-wrap > .auth0-lock-input').type('Vwong123')
    cy.get('.auth0-lock-submit').click()

    });

    cy.wait(4000)

    cy.origin('https://noipm-staging.herokuapp.com', () => {
    Cypress.require("/cypress/support/commands.js");
    cy.get('.MuiIconButton-label > :nth-child(1) > [data-testid="tooltip-VW"]').click();
    cy.get('[data-testid="admin"]').first().click();
    cy.get('[data-testid="pageTitle"]').contains("Admin Portal");
    cy.url().should("eq", "https://noipm-ci.herokuapp.com/admin-portal");

    cy.get(
      '.MuiIconButton-label > :nth-child(1) > [data-testid="tooltip-V"]'
    ).click();
    cy.get('[data-testid="admin"]').first().click();
    cy.get('[data-testid="addSignature"]').click();

    // Add user info
    cy.get('[data-testid="user"]').type("{downarrow}{enter}");
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
