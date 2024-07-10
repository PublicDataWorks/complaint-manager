Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false;
  });

/// <reference types="cypress"/>
it('NOIPM', () => {

    cy.origin('https://noipm-staging.auth0.com', () => {
    cy.visit('https://noipm-staging.herokuapp.com')    
    //cy.get('body').tab()
    cy.get('.auth0-lock-input-email > .auth0-lock-input-wrap > .auth0-lock-input').type('vwong@thoughtworks.com')
    cy.get('.auth0-lock-input-show-password > .auth0-lock-input-block > .auth0-lock-input-wrap > .auth0-lock-input').type('Vwong123')
    cy.get('.auth0-lock-submit').click()
    })

    cy.wait(4000)

    cy.origin('https://noipm-staging.herokuapp.com', () => {

    cy.get('[data-testid="createCaseButton"]').click() //Click create case
    cy.get('[data-testid="createCaseDialogTitle"] > .MuiTypography-root').contains('Create New Case') //Check dialogue title appears

    cy.get('[data-testid="createAndView"] > .MuiButton-label').click() //Click Create and View
    cy.wait(2000)
    cy.get('[data-testid="firstNameField"] > .MuiFormHelperText-root').contains('Please enter First Name') //Error messages
    cy.get('[data-testid="lastNameField"] > .MuiFormHelperText-root').contains('Please enter Last Name') //Error messages
    cy.get('.MuiAutocomplete-endAdornment > .MuiButtonBase-root').click() //Click on dropdown
    cy.get('.MuiAutocomplete-option').contains('Email').click() //Check dropdown option contains "Email" and clicks option
    cy.get('[data-testid="firstNameInput"]').type('TestCypressFirst') //Input first name
    cy.get('[data-testid="lastNameInput"]').type('TestCypressLast') //Input last name
    cy.get('[data-testid="createAndView"] > .MuiButton-label').click() //Click create and view
    cy.get('[data-testid="phoneNumberInput"]').type('1231231234') //Enter phone number
    cy.get('[data-testid="createAndView"] > .MuiButton-label').click()
    
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
    
    cy.origin('https://noipm-staging.herokuapp.com', () => {
    cy.get('.MuiIconButton-label > :nth-child(1) > [data-testid="tooltip-VW"]').click();
    cy.get('[data-testid="tagManagement"]').click();
    cy.get('[data-testid="pageTitle"]').contains('Tag Management');
    cy.url().should('eq', 'https://noipm-staging.herokuapp.com/manage-tags');

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