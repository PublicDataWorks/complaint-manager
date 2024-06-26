/// <reference types="cypress"/>
it('NOIPMLOGIN', () => {

    cy.origin('https://noipm-staging.auth0.com', () => {
    cy.visit('noipm-staging.herokuapp.com')    
    //cy.get('body').tab()
    cy.get('.auth0-lock-input-email > .auth0-lock-input-wrap > .auth0-lock-input').type('vwong@thoughtworks.com')
    cy.get('.auth0-lock-input-show-password > .auth0-lock-input-block > .auth0-lock-input-wrap > .auth0-lock-input').type('Vwong123')
    cy.get('.auth0-lock-submit').click();
    
    })
    
    cy.wait(4000)
    cy.origin('https://noipm-staging.herokuapp.com', () => {
    cy.get('.MuiIconButton-label > :nth-child(1) > [data-testid="tooltip-VW"]').click();
    cy.get('[data-testid="admin"]').first().click();
    cy.get('[data-testid="pageTitle"]').contains('Admin Portal');
    cy.url().should('eq', 'https://noipm-staging.herokuapp.com/admin-portal');

    cy.get(':nth-child(3) > [style="display: flex; width: 100%; padding-right: 0px;"] > section > [data-testid="edit-letter-type-btn"]').click()
    cy.get('[data-testid="letter-type-input"]').type('{selectall}{backspace}');
    cy.get('[data-testid="letter-type-input"]').type('Test Letter Type');
    cy.get('[data-testid="saveButton"]').scrollIntoView();
    cy.get('[data-testid="saveButton"]').click();
    cy.get('[data-testid="sharedSnackbarBannerText"]').contains('Successfully edited letter type');
    cy.get(':nth-child(3) > [style="display: flex; width: 100%; padding-right: 0px;"] > [data-testid="letterTypesPanel"] > .MuiButtonBase-root > .MuiAccordionSummary-content > [style="display: flex; width: 100%; padding-right: 0px; margin-bottom: 4px;"] > [style="display: flex; width: 100%;"] > :nth-child(1) > div').contains('Test Letter Type');
    
    })
    
})