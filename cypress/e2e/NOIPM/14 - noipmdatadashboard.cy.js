/// <reference types="cypress"/>
it('NOIPM', () => {

    cy.origin('https://noipm-staging.auth0.com', () => {
    cy.visit('noipm-staging.herokuapp.com')    
    //cy.get('body').tab()
    cy.get('.auth0-lock-input-email > .auth0-lock-input-wrap > .auth0-lock-input').type('vwong@thoughtworks.com')
    cy.get('.auth0-lock-input-show-password > .auth0-lock-input-block > .auth0-lock-input-wrap > .auth0-lock-input').type('Vwong123')
    cy.get('.auth0-lock-submit').click()
    })

    cy.wait(2000)

    cy.origin('https://noipm-staging.herokuapp.com', () => {
    cy.get('.MuiIconButton-label > :nth-child(1) > [data-testid="tooltip-VW"]').click();
    cy.get('[data-testid="dataDashboard"]').first().click();
    cy.get('[data-testid="pageTitle"]').contains('Data Dashboard');
    cy.url().should('eq', 'https://noipm-staging.herokuapp.com/dashboard');
    
    })
})