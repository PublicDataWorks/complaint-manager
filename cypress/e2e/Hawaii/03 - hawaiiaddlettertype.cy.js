Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false;
  });

/// <reference types="cypress"/>
it('HAWAIILOGIN', () => {

    cy.origin(Cypress.env('url_okta_hawaii'), () => {
    cy.visit(Cypress.env('url_hawaii'))
    cy.wait(2000)
    cy.get('#input28').type(Cypress.env('username_hawaii'), {log: false});
    cy.get('#input36').type(Cypress.env('password_hawaii'), {log: false});
    cy.get('.button').click();
    
    })

    cy.wait(4000)
    cy.origin(Cypress.env('url_hawaii'), () => {
    cy.get('.MuiIconButton-label > :nth-child(1) > [data-testid="tooltip-CM"]').click();
    cy.get('[data-testid="admin"]').first().click();
    cy.get('[data-testid="pageTitle"]').contains('Admin Portal');
  

    cy.get('[data-testid="addLetterType"] > .MuiButton-label').click();
    cy.get('[data-testid="letter-type-input"]').type('Test Letter Type');
    cy.get('[data-testid="requires-approval-checkbox"]').click();
    cy.get('[data-testid="default-sender-dropdown-autocomplete"] > .MuiFormControl-root > .MuiInputBase-root > .MuiAutocomplete-endAdornment').click();
    cy.get('.MuiAutocomplete-option').contains('Christin Johnson').click();
    cy.get('[data-testid="required-status-dropdown-autocomplete"] > .MuiFormControl-root > .MuiInputBase-root > .MuiAutocomplete-endAdornment > .MuiButtonBase-root > .MuiIconButton-label > .MuiSvgIcon-root').click();
    cy.get('.MuiAutocomplete-option').contains('Initial').click();
    cy.get(':nth-child(1) > .MuiButton-label > small').click();
    cy.wait(2000)
    cy.get('[data-testid="saveButton"]').click();
    cy.get('[data-testid="sharedSnackbarBannerText"]').contains('Successfully added letter type');

    cy.wait(3000)
    cy.get('.MuiIconButton-label > :nth-child(1) > [data-testid="tooltip-CM"]').click();
    cy.get('[data-testid="logOutButton"]').click(); // Click on the logout button
})
    
})