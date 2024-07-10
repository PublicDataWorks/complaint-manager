import 'cypress-file-upload';

Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false;
});

/// <reference types="cypress"/>
it('NOIPM', () => {

  cy.origin(Cypress.env('url_auth0_noipm'), () => {
  cy.visit(Cypress.env('url_noipm'))    
  cy.get('.auth0-lock-input-email > .auth0-lock-input-wrap > .auth0-lock-input').type(Cypress.env('username_noipm'), {log: false})
    cy.get('.auth0-lock-input-show-password > .auth0-lock-input-block > .auth0-lock-input-wrap > .auth0-lock-input').type(Cypress.env('password_noipm'), {log: false})

  })

    cy.wait(4000)

    cy.origin(Cypress.env('url_noipm'), () => {
    cy.get('.MuiIconButton-label > :nth-child(1) > [data-testid="tooltip-VW"]').click();
    cy.get('[data-testid="admin"]').first().click();
    cy.get('[data-testid="pageTitle"]').contains('Admin Portal');

    cy.get(':nth-child(3) > [style="display: flex; align-items: center; justify-content: flex-end; width: 50%; padding: 0px 30px 10px 0px;"] > .MuiButton-containedPrimary > .MuiButton-label').click();
    cy.get('[data-testid="phoneNumber"]').clear().type('1231231244');
    cy.get('[data-testid="saveButton"]').click();
    cy.get(':nth-child(2) > [style="min-width: 50em; padding: 5px;"] > .MuiPaper-root > :nth-child(3)').contains('123-123-1244')

    cy.get(':nth-child(3) > [style="display: flex; align-items: center; justify-content: flex-end; width: 50%; padding: 0px 30px 10px 0px;"] > .MuiButton-containedPrimary > .MuiButton-label').click();
    cy.get('[data-testid="phoneNumber"]').clear().type('1231231234');
    cy.get('[data-testid="saveButton"]').click();
    cy.get(':nth-child(2) > [style="min-width: 50em; padding: 5px;"] > .MuiPaper-root > :nth-child(3)').contains('123-123-1234')

    })
})