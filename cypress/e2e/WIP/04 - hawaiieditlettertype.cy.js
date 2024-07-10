Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false;
  });

/// <reference types="cypress"/>
it('HAWAIILOGIN', () => {

    cy.origin('https://dev-68895481.okta.com', () => {
    cy.visit('https://hcsoc-staging-0171a859e889.herokuapp.com')
    cy.wait(2000)
    cy.get('#input28').type('pdm@publicdata.works');
    cy.get('#input36').type('wnc3ubf-hqf-rcr1ZPH');
    cy.get('.button').click();
    
    })
    cy.wait(4000)
    cy.origin('https://hcsoc-staging-0171a859e889.herokuapp.com', () => {
    cy.get('.MuiIconButton-label > :nth-child(1) > [data-testid="tooltip-CM"]').click();
    cy.get('[data-testid="admin"]').first().click();
    cy.get('[data-testid="pageTitle"]').contains('Admin Portal');
    cy.url().should('eq', 'https://hcsoc-staging-0171a859e889.herokuapp.com/admin-portal');

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
    //cy.get(':nth-child(3) > [style="display: flex; width: 100%; padding-right: 0px;"] > [data-testid="letterTypesPanel"] > .MuiButtonBase-root > .MuiAccordionSummary-content > [style="display: flex; width: 100%; padding-right: 0px; margin-bottom: 4px;"] > [style="display: flex; width: 100%;"] > :nth-child(1) > div > [data-testid="letter-type"]').contains('Test Letter Type');
    
})
    
})