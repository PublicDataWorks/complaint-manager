Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false;
  });

/// <reference types="cypress"/>
it('NOIPMLOGIN', () => {

    cy.origin(Cypress.env('url_auth0_noipm'), () => {
    cy.visit(Cypress.env('url_noipm'))    
    cy.get('.auth0-lock-input-email > .auth0-lock-input-wrap > .auth0-lock-input').type(Cypress.env('username_noipm'), {log: false})
    cy.get('.auth0-lock-input-show-password > .auth0-lock-input-block > .auth0-lock-input-wrap > .auth0-lock-input').type(Cypress.env('password_noipm'), {log: false})
    cy.get('.auth0-lock-submit').click();
    
    })
    cy.wait(4000)
    cy.origin(Cypress.env('url_noipm'), () => {
    cy.get('.MuiIconButton-label > :nth-child(1) > [data-testid="tooltip-VW"]').click();
    cy.get('[data-testid="admin"]').first().click();
    cy.get('[data-testid="pageTitle"]').contains('Admin Portal');

    cy.get('[data-testid="addLetterType"] > .MuiButton-label').click();
    cy.get('[data-testid="letter-type-input"]').type('Test Letter Typee');
    cy.get('[data-testid="requires-approval-checkbox"]').click();
    cy.get('[data-testid="default-sender-dropdown-autocomplete"] > .MuiFormControl-root > .MuiInputBase-root > .MuiAutocomplete-endAdornment').click();
    cy.get('.MuiAutocomplete-option').contains('Stella Cziment').click();
    cy.get('[data-testid="required-status-dropdown-autocomplete"] > .MuiFormControl-root > .MuiInputBase-root > .MuiAutocomplete-endAdornment > .MuiButtonBase-root > .MuiIconButton-label > .MuiSvgIcon-root').click();
    cy.get('.MuiAutocomplete-option').contains('Initial').click();
    cy.get('[data-testid="saveButton"]').scrollIntoView();
    cy.get('[data-testid="saveButton"]').click();
    cy.get('[data-testid="sharedSnackbarBannerText"]').contains('Successfully added letter type');
    cy.wait(2000)
})
    
})