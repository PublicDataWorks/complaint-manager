import 'cypress-file-upload';

/// <reference types="cypress"/>
it('NOIPM', () => {

    cy.origin('https://noipm-staging.auth0.com', () => {
    cy.visit('noipm-staging.herokuapp.com')    
    cy.get('.auth0-lock-input-email > .auth0-lock-input-wrap > .auth0-lock-input').type('vwong@thoughtworks.com')
    cy.get('.auth0-lock-input-show-password > .auth0-lock-input-block > .auth0-lock-input-wrap > .auth0-lock-input').type('Vwong123')
    cy.get('.auth0-lock-submit').click()
    })

    cy.wait(4000)
    cy.origin('https://noipm-staging.herokuapp.com', () => {
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