/// <reference types="cypress"/>
it('NOIPM', () => {

    cy.origin('https://noipm-staging.auth0.com', () => {
    cy.visit('noipm-staging.herokuapp.com')    
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

    cy.get('[data-testid="addAccusedMenu"]').contains('Add Accused').click();
    cy.get('[data-testid="addAccusedCivilian Within NOPD"]').click();
    cy.get('.MuiAutocomplete-endAdornment > .MuiButtonBase-root').click();
    cy.get('.MuiAutocomplete-option').contains('2nd District').click();    
    cy.get('[data-testid="officerSearchSubmitButton"]').click();
    cy.get('[data-testid="selectNewOfficerButton"]').first().click();
    cy.get('[data-testid="officerSubmitButton"] > .MuiButton-label').click();
    cy.get('[data-testid="Civilian (NOPD)FullName"]').contains('Gideon B Abshire');

    cy.get('[data-testid="update-status-button"]').click();
    cy.get('[data-testid="update-case-status-button"]').click();
    cy.get('[data-testid="next-button"]').click();

    cy.get('[data-testid="letterOfficers[0]-option-1"]').click();
    cy.get('[data-testid="next-button"]').click();
    cy.wait(2000)
    cy.get('[data-testid="next-button"]').click();
    cy.get('[data-testid="submit-for-review-button"]').click();
    cy.get('[data-testid="dialogText"]').contains('In order to submit your letter, you must complete Recommended Actions - Classifications. Please return to this step and fill in the pertinent details.')
    cy.get('[data-testid="close-incomplete-history-dialog"] > .MuiButton-label').click();

    })

})
    