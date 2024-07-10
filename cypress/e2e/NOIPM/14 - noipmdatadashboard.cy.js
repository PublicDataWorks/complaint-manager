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

    cy.wait(2000)

    cy.origin(Cypress.env('url_noipm'), () => {
    cy.get('.MuiIconButton-label > :nth-child(1) > [data-testid="tooltip-VW"]').click();
    cy.get('[data-testid="dataDashboard"]').first().click();
    cy.get('[data-testid="pageTitle"]').contains('Data Dashboard');
    cy.url().should('eq', 'https://noipm-staging.herokuapp.com/dashboard');
    
    })
})