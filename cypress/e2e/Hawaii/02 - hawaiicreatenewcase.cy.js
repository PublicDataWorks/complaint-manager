Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false;
  });

/// <reference types="cypress"/>
it('HAWAIILOGIN', () => {

    cy.origin('https://dev-68895481.okta.com', () => {
    cy.visit('https://hcsoc-staging-0171a859e889.herokuapp.com/')
    cy.wait(2000)
    cy.get('#input28').type('pdm@publicdata.works');
    cy.get('#input36').type('wnc3ubf-hqf-rcr1ZPH');
    cy.get('.button').click();
    
    })

    cy.wait(4000)

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
    cy.get('.MuiAutocomplete-option').contains('new tag').click()
    cy.get('[data-testid="caseTagSubmitButton"] > .MuiButton-label').click()
    cy.wait(3000)
    cy.get('[data-testid="caseTagsContainer"]').contains('new tag')

    cy.get('[data-testid="addCaseNoteButton"] > .MuiButton-label').click()
    cy.get('.MuiAutocomplete-popupIndicator').click()
    cy.get('.MuiAutocomplete-option').contains('Contacted NOPD').click()
    cy.get('[data-testid="notesInput"]').type('Test Note');
    cy.get('[data-testid="submitButton"] > .MuiButton-label').click()
    cy.wait(2000)
    cy.get('[data-testid="caseNotesContainer"]').contains('Test Note')

    cy.get('[style="margin: 0px 24px;"] > [style="display: flex;"] > .MuiButtonBase-root > .MuiButton-label').click()
    cy.get('.MuiTableBody-root > :nth-child(2) > :nth-child(3)').contains('Tag Name: new tag')
    cy.get('.MuiTableBody-root > :nth-child(1) > :nth-child(3)').contains('Action: Contacted NOPD')
    cy.get('.MuiTableBody-root > :nth-child(3) > :nth-child(3)').contains('Person in Custody ID: A7646669')
    cy.get(':nth-child(4) > :nth-child(3)').contains('Case Reference')

    })
    

})