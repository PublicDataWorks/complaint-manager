Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false;
  });

/// <reference types="cypress"/>
it('HAWAIILOGIN', () => {

    cy.origin(Cypress.env('url_okta_hawaii'), () => {
    cy.visit(Cypress.env('url_hawaii')) // Hawaii staging link
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


    cy.get(':nth-child(1) > [style="display: flex; width: 100%; padding-right: 0px;"] > section > [data-testid="edit-letter-type-btn"] > .MuiButton-label').click();
    cy.get('[data-testid="letter-type-input"]').type('{selectall}{backspace}');
    cy.get('[data-testid="letter-type-input"]').type("CAN'T HELPP");
    cy.get('[data-testid="required-status-dropdown-autocomplete"] > .MuiFormControl-root > .MuiInputBase-root > .MuiAutocomplete-endAdornment > .MuiButtonBase-root > .MuiIconButton-label > .MuiSvgIcon-root').click();
    //cy.get('.MuiAutocomplete-option').contains('Initial').click();
    cy.get('[data-testid="saveButton"]').scrollIntoView();
    cy.get('[data-testid="saveButton"]').click();
    cy.get('[data-testid="sharedSnackbarBannerText"]').contains('Successfully edited letter type');

    cy.get(':nth-child(1) > [style="display: flex; width: 100%; padding-right: 0px;"] > section > [data-testid="edit-letter-type-btn"] > .MuiButton-label').click();
    cy.get('[data-testid="letter-type-input"]').type('{selectall}{backspace}');
    cy.get('[data-testid="letter-type-input"]').type("CAN'T HELPPP");
    cy.get('[data-testid="saveButton"]').scrollIntoView();
    cy.get('[data-testid="saveButton"]').click();
    cy.get('[data-testid="sharedSnackbarBannerText"]').contains('Successfully edited letter type');
    
    cy.wait(3000)
    cy.get('.MuiIconButton-label > :nth-child(1) > [data-testid="tooltip-CM"]').click();
    cy.get('[data-testid="logOutButton"]').click(); // Click on the logout button
    
})
    
})