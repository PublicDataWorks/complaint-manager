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
    cy.get('.auth0-lock-submit').click()
    })

    cy.wait(4000)
    cy.origin(Cypress.env('url_noipm'), () => {
    cy.get('[data-testid="searchField"').type('Smith{enter}');
    cy.get('[data-testid="caseRow1361"] > [data-testid="caseName"]').contains('Smith');
    cy.get('[data-testid="homeButton"]').click();
    cy.get('[data-testid="searchField"]').clear();
    cy.get('[data-testid="searchField"]').type('Smith NOT Jones{enter}');
    cy.wait(2000)
    cy.get('[data-testid="caseRow1361"] > [data-testid="caseName"] > div').should('not.contain', 'Jones');
    cy.get('[data-testid="caseRow1361"] > [data-testid="caseName"]').contains('Smith');
    
    })
})