import 'cypress-file-upload';

Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false;
});

/// <reference types="cypress"/>
it('HAWAII', () => {

  cy.origin(Cypress.env('url_okta_hawaii'), () => {
  cy.visit(Cypress.env('url_hawaii'))
  cy.wait(2000)
  cy.get('#input28').type(Cypress.env('username_hawaii'), {log: false});
  cy.get('#input36').type(Cypress.env('password_hawaii'), {log: false});
  cy.get('.button').click();
      
  })

    cy.wait(4000)

    cy.origin(Cypress.env('url_hawaii'), () => {
    cy.get('.MuiIconButton-label > :nth-child(1) > [data-testid="tooltip-CM"]').click();
    cy.get('[data-testid="admin"]').first().click();
    cy.get('[data-testid="pageTitle"]').contains('Admin Portal');
    cy.url().should('eq', 'https://hcsoc-staging-0171a859e889.herokuapp.com/admin-portal');

    cy.get('[style="display: flex; align-items: center; justify-content: flex-end; width: 50%; padding: 0px 30px 10px 0px;"] > .MuiButton-containedPrimary').click();
    cy.get('[data-testid="phoneNumber"]').type('1231231244');
    cy.get('[data-testid="saveButton"]').click();
    cy.get('[data-testid="Phone Number"]').eq(2).contains('123-123-1244');
    
    })
})