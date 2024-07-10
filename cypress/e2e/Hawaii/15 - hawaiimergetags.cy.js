Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false;
  });

/// <reference types="cypress"/>
it('HAWAII', () => {

    cy.origin('https://dev-68895481.okta.com', () => {
    cy.visit('https://hcsoc-staging-0171a859e889.herokuapp.com/')
    cy.wait(2000)
    cy.get('#input28').type('pdm@publicdata.works');
    cy.get('#input36').type('wnc3ubf-hqf-rcr1ZPH');
    cy.get('.button').click();
        
    })

    cy.wait(2000)

    cy.origin('https://hcsoc-staging-0171a859e889.herokuapp.com/', () => {

    cy.get('[data-testid="createCaseButton"]').click() //Click create case
    cy.get('[data-testid="createCaseDialogTitle"] > .MuiTypography-root').contains('Create New Case') //Check dialogue title appears

    cy.get('[data-testid="createAndSearch"]').click() //Click Create and View
    cy.get('[data-testid="intakeSourceInput-autocomplete"] > .MuiFormControl-root').contains('Please enter Intake Source') //Error messages
    cy.get('[data-testid="complaintTypeDropdown-autocomplete"] > .MuiFormControl-root').contains('Please enter Complaint Type') //Error messages
    cy.get('[data-testid="intakeSourceInput-autocomplete"] > .MuiFormControl-root > .MuiInputBase-root > .MuiAutocomplete-endAdornment').click() //Click on intake source dropdown
    cy.get('.MuiAutocomplete-option').contains('Email').click() //Check dropdown option contains "Email" and clicks option
    cy.get('[data-testid="complaintTypeDropdown-autocomplete"] > .MuiFormControl-root > .MuiInputBase-root > .MuiAutocomplete-endAdornment').click() //Click complaint type dropdown
    cy.get('.MuiAutocomplete-option').contains('Food').click()
    cy.get('[data-testid="createAndSearch"] > .MuiButton-label').click()
    cy.get('[data-testid="sharedSnackbarBannerText"]').contains('Case was successfully created')
    cy.get('.MuiAutocomplete-endAdornment > .MuiButtonBase-root').click()
    cy.get('.MuiAutocomplete-option').contains('Halawa Correctional Facility').click()
    cy.get('[data-testid="inmateSearchSubmitButton"]').click()
    cy.get('[data-testid="A7646669-select-button"]').click()
    cy.get('[data-testid="inmate-submit-button"]').click()
    cy.get('[data-testid="sharedSnackbarBannerText"]').contains('Person in Custody Successfully Added to Case')
    
    cy.get('[data-testid="addTagButton"] > .MuiButton-label').click()
    cy.get('.MuiAutocomplete-popupIndicator').click()
    cy.get('[data-testid="caseTagDropdownInput"]').type('Test 1').click()
    cy.get('.MuiAutocomplete-option').contains('Create "Test 1"').click()
    cy.get('[data-testid="caseTagSubmitButton"] > .MuiButton-label').click()
    cy.get('[data-testid="caseTagsContainer"]').contains('Test 1')

    cy.get('[data-testid="addTagButton"] > .MuiButton-label').click()
    cy.get('.MuiAutocomplete-popupIndicator').click()
    cy.get('[data-testid="caseTagDropdownInput"]').type('Test 2').click()
    cy.get('.MuiAutocomplete-option').contains('Create "Test 2"').click()
    cy.get('[data-testid="caseTagSubmitButton"] > .MuiButton-label').click()
    cy.get('[data-testid="caseTagsContainer"]').contains('Test 2')

    })    
    
    cy.origin('https://hcsoc-staging-0171a859e889.herokuapp.com/', () => {
    cy.get('.MuiIconButton-label > :nth-child(1) > [data-testid="tooltip-CM"]').click();
    cy.get('[data-testid="tagManagement"]').click();
    cy.get('[data-testid="pageTitle"]').contains('Tag Management');
    cy.url().should('eq', 'https://hcsoc-staging-0171a859e889.herokuapp.com/manage-tags');

    cy.wait(4000)

    cy.get('[data-testid="tagTableRow-Test 2"] > :nth-child(4) > [data-testid="mergeTagButton"] > .MuiButton-label').click()
    cy.get('[data-testid="select-merge-tag-dropdown-autocomplete"]').type('Test 1')
    cy.get('.MuiAutocomplete-option').contains('Test 1').click()
    cy.get('[data-testid="mergeTagSubmitButton"] > .MuiButton-label').click()
    cy.get('[data-testid="tagTableRow-Test 1"] > :nth-child(2)').contains('1')
    cy.get('[data-testid="tagTableRow-Test 1"] > :nth-child(5) > [data-testid="removeTagButton"] > .MuiButton-label').click()
    cy.get('[data-testid="dialog-confirm-button"]').click()

    })
})