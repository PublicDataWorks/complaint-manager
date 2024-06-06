/// <reference types="cypress"/>
it('NOIPM', () => {

    cy.origin('https://noipm-staging.auth0.com', () => {
    cy.visit('noipm-staging.herokuapp.com')    
    //cy.get('body').tab()
    cy.get('.auth0-lock-input-email > .auth0-lock-input-wrap > .auth0-lock-input').type('vwong@thoughtworks.com')
    cy.get('.auth0-lock-input-show-password > .auth0-lock-input-block > .auth0-lock-input-wrap > .auth0-lock-input').type('Vwong123')
    cy.get('.auth0-lock-submit').click()
    })

    cy.wait(3000)

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
    cy.get('[data-testid="caseTagDropdownInput"]').type('Test Tag')
    cy.get('.MuiAutocomplete-option').first().click()
    cy.get('[data-testid="caseTagSubmitButton"] > .MuiButton-label').click()
    cy.get('[data-testid="caseTagsContainer"]').contains('Test Tag')

    cy.get('.MuiIconButton-label > :nth-child(1) > [data-testid="tooltip-VW"]').click();
    cy.get('[data-testid="tagManagement"]').click();
    cy.get('[data-testid="pageTitle"]').contains('Tag Management');
    cy.url().should('eq', 'https://noipm-staging.herokuapp.com/manage-tags');
    cy.wait(2000)
    //cy.get('.jss21 > :nth-child(1) > .MuiPaper-root').scrollTo('bottom', {ensureScrollable: false});
    cy.get('[data-testid="tagTableRow-Test Tag"] > :nth-child(1) > div').contains('Test Tag');
    cy.get('[data-testid="tagTableRow-Test Tag"] > :nth-child(3) > [data-testid="editTagButton"] > .MuiButton-label').click();
    cy.get('[data-testid="editTagTextBox"]').clear().type('Test Tagg');
    cy.get('[data-testid="saveTagButton"]').click();
    cy.get('[data-testid="tagTableRow-Test Tagg"] > :nth-child(1) > div').contains('Test Tagg');
    cy.get('[data-testid="tagTableRow-Test Tagg"] > :nth-child(5) > [data-testid="removeTagButton"] > .MuiButton-label').click();
    cy.get('.MuiDialogContent-root').contains('You are about to delete the tag "Test Tagg"');
    cy.get('[data-testid="dialog-confirm-button"]').click();
    cy.get('main').should('not.contain', 'Test Tagg');

    })
})