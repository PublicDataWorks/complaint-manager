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
    cy.get('.MuiIconButton-label > :nth-child(1) > [data-testid="tooltip-VW"]').click();
    cy.get('[data-testid="admin"]').first().click();
    cy.get('[data-testid="pageTitle"]').contains('Admin Portal');
    cy.url().should('eq', 'https://noipm-staging.herokuapp.com/admin-portal');

    cy.get(':nth-child(5) > [style="display: flex; align-items: center; justify-content: flex-end; width: 50%; padding: 0px 30px 10px 0px;"] > .MuiButton-containedPrimary').click();
    cy.get('[data-testid="phoneNumber"]').clear().type('1231231244');
    cy.get('[data-testid="saveButton"]').click();
    cy.get(':nth-child(5) > .jss26 > :nth-child(3) > div > [data-testid="Phone Number"]').contains('123-123-1244')

    })
})