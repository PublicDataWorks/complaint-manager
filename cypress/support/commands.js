// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// imports attachFile command
import "cypress-file-upload";
// require('@4tw/cypress-drag-drop')
// require('cypress-downloadfile/lib/downloadFileCommand');
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
Cypress.Commands.add('hawaii_Logout', () => {
  // Assuming the logout process involves clicking on a button to open a logout menu
  cy.get('.MuiIconButton-label > :nth-child(1) > [data-testid="tooltip-CM"]').click();
  // And then clicking on the actual logout button
  cy.get('[data-testid="logOutButton"]').click();
  // Optionally, add assertions here to verify successful logout, e.g., checking for the login URL
  cy.url().should('contain', 'https://hcsoc-staging-0171a859e889.herokuapp.com/login'); // Adjust the URL to match your application's logged-out state
});
Cypress.Commands.add('noipmLogout', () => {
    // Assuming the logout process involves clicking on a button to open a logout menu
    cy.get('.MuiIconButton-label > :nth-child(1) > [data-testid="tooltip-VW"]').click();
    // And then clicking on the actual logout button
    cy.get('[data-testid="logOutButton"]').click();
  
    // Optionally, add assertions here to verify successful logout, e.g., checking for the login URL
    cy.url().should('contain', 'https://noipm-staging.auth0.com/login'); // Adjust the URL to match your application's logged-out state
  });
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })