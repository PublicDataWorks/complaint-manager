Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false;
  });

/// <reference types="cypress"/>
it('NOIPM', () => {

    cy.origin(Cypress.env('url_auth0_noipm'), () => {
    cy.visit(Cypress.env('url_noipm'))    
    cy.get('.auth0-lock-input-email > .auth0-lock-input-wrap > .auth0-lock-input').type(Cypress.env('username_noipm'), {log: false})
    cy.get('.auth0-lock-input-show-password > .auth0-lock-input-block > .auth0-lock-input-wrap > .auth0-lock-input').type(Cypress.env('password_noipm'), {log: false})
    cy.get('.auth0-lock-submit').click()
    })

    cy.wait(4000)
    cy.origin(Cypress.env('url_noipm'), () => {
    cy.get('.MuiIconButton-label > :nth-child(1) > [data-testid="tooltip-VW"]').click();
    cy.get('[data-testid="admin"]').first().click();
    cy.get('[data-testid="pageTitle"]').contains('Admin Portal');

    cy.get(':nth-child(3) > [style="display: flex; width: 100%; padding-right: 0px;"] > section > [data-testid="delete-letter-type-btn"]').click();
    cy.get('.MuiDialogContent-root > div > strong').contains('Are you sure you want to permanently delete this letter template?');
    cy.get('.MuiDialogContent-root').contains('By selecting "Yes", you will not be able to generate any new letters using this template. This action will not affect previously generated letters.');
    cy.get('[data-testid="dialog-confirm-button"]').click();
    cy.get('[data-testid="sharedSnackbarBannerText"]').contains('Letter type successfully deleted');
    cy.get('[data-testid="letterTypesPanel"] > .MuiButtonBase-root').should('not.contain', 'Test Letter Type');
    })
})