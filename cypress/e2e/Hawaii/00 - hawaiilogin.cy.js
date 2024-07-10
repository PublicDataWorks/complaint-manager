Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false;
});

/// <reference types="cypress"/>
it('HAWAIILOGIN', () => {

    cy.origin(Cypress.env('url_okta_hawaii'), () => { // Hawaii okta link
    cy.visit(Cypress.env('url_hawaii')) // Hawaii staging link
    cy.wait(2000)
    cy.get('#input28').type(Cypress.env('username_hawaii'), {log: false}); // Enter Username
    cy.get('#input36').type(Cypress.env('password_hawaii'), {log: false}); // Enter Password
    cy.get('.button').click(); // Click on the login button
   
    })

    cy.origin(Cypress.env('url_hawaii'), () => {
    
    Cypress.require("/cypress/support/commands.js");

    cy.url().should('eq', 'https://hcsoc-staging-0171a859e889.herokuapp.com/'); // Check if the URL is correct after signing in 
    
    cy.wait(2000)

    cy.hawaii_Logout(); 

})
})