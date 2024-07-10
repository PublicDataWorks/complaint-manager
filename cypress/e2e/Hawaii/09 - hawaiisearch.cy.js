import 'cypress-file-upload';

Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false;
  });

// <reference types="cypress"/>
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