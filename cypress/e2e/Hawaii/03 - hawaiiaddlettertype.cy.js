/// <reference types="cypress"/>
it('HAWAIILOGIN', () => {

    cy.origin('https://dev-68895481.okta.com', () => {
    cy.visit('noipm-staging.herokuapp.com')
    cy.wait(2000)
    cy.get('#input28').type('pdm@publicdata.works');
    cy.get('#input36').type('wnc3ubf-hqf-rcr1ZPH');
    cy.get('.button').click();
    
    })
    cy.wait(4000)
    cy.origin('https://noipm-staging.herokuapp.com', () => {
    cy.get('.MuiIconButton-label > :nth-child(1) > [data-testid="tooltip-CM"]').click();
    cy.get('[data-testid="admin"]').first().click();
    cy.get('[data-testid="pageTitle"]').contains('Admin Portal');
    cy.url().should('eq', 'https://noipm-staging.herokuapp.com/admin-portal');

    cy.get('[data-testid="addLetterType"] > .MuiButton-label').click();
    cy.get('[data-testid="letter-type-input"]').type('Test Letter Typee');
    cy.get('[data-testid="requires-approval-checkbox"]').click();
    cy.get('[data-testid="default-sender-dropdown-autocomplete"] > .MuiFormControl-root > .MuiInputBase-root > .MuiAutocomplete-endAdornment').click();
    cy.get('.MuiAutocomplete-option').contains('Christin Johnson').click();
    cy.get('[data-testid="required-status-dropdown-autocomplete"] > .MuiFormControl-root > .MuiInputBase-root > .MuiAutocomplete-endAdornment > .MuiButtonBase-root > .MuiIconButton-label > .MuiSvgIcon-root').click();
    cy.get('.MuiAutocomplete-option').contains('Initial').click();
    cy.get(':nth-child(7) > .MuiButtonBase-root > .MuiIconButton-label > .jss67').click();
    cy.get('[data-testid="saveButton"]').scrollIntoView();
    cy.get('[data-testid="saveButton"]').click();
    cy.get('[data-testid="sharedSnackbarBannerText"]').contains('Successfully added letter type');
})
    
})