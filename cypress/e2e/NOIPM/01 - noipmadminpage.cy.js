Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false;
  });

/// <reference types="cypress"/>
it('NOIPM', () => {

    cy.origin(Cypress.env('url_auth0_noipm'), () => {
    cy.visit(Cypress.env('url_noipm')) // NOIPM staging link    
    cy.get('.auth0-lock-input-email > .auth0-lock-input-wrap > .auth0-lock-input').type(Cypress.env('username_noipm'), {log: false}) // Enter Username
    cy.get('.auth0-lock-input-show-password > .auth0-lock-input-block > .auth0-lock-input-wrap > .auth0-lock-input').type(Cypress.env('password_noipm'), {log: false}) // Enter Password
    cy.get('.auth0-lock-submit').click() // Click login button
    })

    cy.wait(6000)

    cy.origin(Cypress.env('url_noipm'), () => {
    
    cy.get('.MuiIconButton-label > :nth-child(1) > [data-testid="tooltip-VW"]').click(); // Click on initials icon on top right
    cy.get('[data-testid="admin"]').first().click(); // Click on Admin
    cy.get('[data-testid="pageTitle"]').contains('Admin Portal'); // Verify page title contains Admin Portal

    })
})