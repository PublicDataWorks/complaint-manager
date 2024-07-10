Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false;
  });

/// <reference types="cypress"/>
it('HAWAIILOGIN', () => {

    cy.origin(Cypress.env('url_okta_hawaii'), () => {
    cy.visit(Cypress.env('url_hawaii')) // Hawaii staging link
    cy.wait(2000)
    cy.get('#input28').type(Cypress.env('username_hawaii'), {log: false}); // Enter Username
    cy.get('#input36').type(Cypress.env('password_hawaii'), {log: false}); // Enter Password
    cy.get('.button').click(); // Click on the login button
    })

    cy.wait(6000)

    cy.origin(Cypress.env('url_hawaii'), () => {
    cy.get('.MuiIconButton-label > :nth-child(1) > [data-testid="tooltip-CM"]').click(); // Click on initials icon on top right
    cy.get('[data-testid="admin"]').first().click(); // Click on Admin
    cy.get('[data-testid="pageTitle"]').contains('Admin Portal'); // Verify page title contains Admin Portal
    cy.url().should('eq', 'https://hcsoc-staging-0171a859e889.herokuapp.com/admin-portal'); // Verify URL is correct

    cy.get('.MuiIconButton-label > :nth-child(1) > [data-testid="tooltip-CM"]').click();
    cy.get('[data-testid="logOutButton"]').click(); // Click on the logout button

    })
})