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
    cy.get('[data-testid="addTagButton"] > .MuiButton-label').click()
    cy.get('[data-testid="caseTagDropdownInput"]').type('new tag')
    cy.get('.MuiAutocomplete-option').first().click()
    cy.get('[data-testid="caseTagSubmitButton"] > .MuiButton-label').click()
    cy.get('[data-testid="caseTagsContainer"]').contains('new tag')

    cy.get('[data-testid="addCaseNoteButton"] > .MuiButton-label').click()
    cy.get('.MuiAutocomplete-popupIndicator').click()
    cy.get('.MuiAutocomplete-option').contains('Contacted NOPD').click()
    cy.get('[data-testid="notesInput"]').type('Test Note');
    cy.get('[data-testid="submitButton"] > .MuiButton-label').click()
    cy.get('[data-testid="caseNotesContainer"]').contains('Test Note')

    cy.get('[style="margin: 0px 24px;"] > [style="display: flex;"] > .MuiButtonBase-root > .MuiButton-label').click()
    cy.get('.MuiTableBody-root > :nth-child(2) > :nth-child(3)').contains('Tag Name: new tag')
    cy.get('.MuiTableBody-root > :nth-child(1) > :nth-child(3)').contains('Action: Contacted NOPD')

    })

})
    