Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false;
  });

/// <reference types="cypress"/>
it('NOIPMLOGIN', () => {

    cy.origin(Cypress.env('url_auth0_noipm'), () => {
    cy.visit(Cypress.env('url_noipm'))    
    //cy.get('body').tab()
    cy.get('.auth0-lock-input-email > .auth0-lock-input-wrap > .auth0-lock-input').type(Cypress.env('username_noipm'), {log: false})
    cy.get('.auth0-lock-input-show-password > .auth0-lock-input-block > .auth0-lock-input-wrap > .auth0-lock-input').type(Cypress.env('password_noipm'), {log: false})
    cy.get('.auth0-lock-submit').click();
    
    })
    
    cy.wait(4000)
    cy.origin(Cypress.env('url_noipm'), () => {
    cy.get('.MuiIconButton-label > :nth-child(1) > [data-testid="tooltip-VW"]').click();
    cy.get('[data-testid="admin"]').first().click();
    cy.get('[data-testid="pageTitle"]').contains('Admin Portal');

    cy.get(':nth-child(3) > [style="display: flex; width: 100%; padding-right: 0px;"] > section > [data-testid="edit-letter-type-btn"]').click()
    cy.get('[data-testid="letter-type-input"]').type('{selectall}{backspace}');
    cy.get('[data-testid="letter-type-input"]').type('Test Letter Type');
    cy.get('[data-testid="saveButton"]').scrollIntoView();
    cy.get('[data-testid="saveButton"]').click();
    cy.get('[data-testid="sharedSnackbarBannerText"]').contains('Successfully edited letter type');
    cy.get(':nth-child(3) > [style="display: flex; width: 100%; padding-right: 0px;"] > [data-testid="letterTypesPanel"] > .MuiButtonBase-root > .MuiAccordionSummary-content > [style="display: flex; width: 100%; padding-right: 0px; margin-bottom: 4px;"] > [style="display: flex; width: 100%;"] > :nth-child(1) > div').contains('Test Letter Type');
    
    })
    
})