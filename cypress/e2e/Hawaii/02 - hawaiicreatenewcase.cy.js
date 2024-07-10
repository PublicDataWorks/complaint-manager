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
    cy.get('#input28').type(Cypress.env('username_hawaii'), {log: false}); // Enter Username
    cy.get('#input36').type(Cypress.env('password_hawaii'), {log: false}); // Enter Password
    cy.get('.button').click(); // Click login button
    
    })

    cy.wait(4000)

    cy.origin(Cypress.env('url_hawaii'), () => {

    cy.get('[data-testid="createCaseButton"]').click() //Click create case
    cy.get('[data-testid="createCaseDialogTitle"] > .MuiTypography-root').contains('Create New Case') //Check dialogue title appears

    cy.get('[data-testid="createAndSearch"]').click() //Click Create and Search
    cy.get('[data-testid="intakeSourceInput-autocomplete"] > .MuiFormControl-root').contains('Please enter Intake Source') // Verify error messages appear
    cy.get('[data-testid="complaintTypeDropdown-autocomplete"] > .MuiFormControl-root').contains('Please enter Complaint Type') // Verify error messages appear
    cy.get('[data-testid="intakeSourceInput-autocomplete"] > .MuiFormControl-root > .MuiInputBase-root > .MuiAutocomplete-endAdornment').click() //Click on intake source dropdown
    cy.get('.MuiAutocomplete-option').contains('Email').click() // Check dropdown option contains "Email" and clicks option
    cy.get('[data-testid="complaintTypeDropdown-autocomplete"] > .MuiFormControl-root > .MuiInputBase-root > .MuiAutocomplete-endAdornment').click() //Click complaint type dropdown
    cy.get('.MuiAutocomplete-option').contains('Food').click() // Click on Food
    cy.get('[data-testid="createAndSearch"] > .MuiButton-label').click() // Click on Create and Search
    cy.get('[data-testid="sharedSnackbarBannerText"]').contains('Case was successfully created') // Verify success message appears
    cy.get('.MuiAutocomplete-endAdornment > .MuiButtonBase-root').click() // Click on facility dropdown
    cy.get('.MuiAutocomplete-option').contains('Halawa Correctional Facility').click() // Select Halawa Correctional Facility
    cy.get('[data-testid="inmateSearchSubmitButton"]').click() // Click search 
    cy.get('[data-testid="A7646669-select-button"]').click() // Select an inmate
    cy.get('[data-testid="inmate-submit-button"]').click() // Click Create and View
    cy.get('[data-testid="sharedSnackbarBannerText"]').contains('Person in Custody Successfully Added to Case') // Verify success message appears after adding person in custody to case
    
    cy.get('[data-testid="addTagButton"] > .MuiButton-label').click() // Click Add Tag
    cy.get('.MuiAutocomplete-popupIndicator').click() // Click on tag dropdown
    cy.get('.MuiAutocomplete-option').contains('new tag').click() // Verify new tag appears in dropdown and click on it
    cy.get('[data-testid="caseTagSubmitButton"] > .MuiButton-label').click() // Click Add Tag
    cy.wait(3000)
    cy.get('[data-testid="caseTagsContainer"]').contains('new tag') // Verify case tag appears
 
    cy.get('[data-testid="addCaseNoteButton"] > .MuiButton-label').click() // Click Add Case Note
    cy.get('.MuiAutocomplete-popupIndicator').click() // Click action taken dropdown
    cy.get('.MuiAutocomplete-option').contains('Contacted NOPD').click() // Verify dropdown contacts "Contacted NOPD" and click on it
    cy.get('[data-testid="notesInput"]').type('Test Note'); // Type Test Notes in text input field
    cy.get('[data-testid="submitButton"] > .MuiButton-label').click() // Click Add Case Note
    cy.wait(2000)
    cy.get('[data-testid="caseNotesContainer"]').contains('Test Note') // Verify Test Note appears in case notes

    cy.get('[style="margin: 0px 24px;"] > [style="display: flex;"] > .MuiButtonBase-root > .MuiButton-label').click() // Click Case History
    cy.get('.MuiTableBody-root > :nth-child(2) > :nth-child(3)').contains('Tag Name: new tag') // Verify action contains "Tag Name: new tag"
    cy.get('.MuiTableBody-root > :nth-child(1) > :nth-child(3)').contains('Action: Contacted NOPD') // Verify action contains "Action: Contacted NOPD"
    cy.get('.MuiTableBody-root > :nth-child(3) > :nth-child(3)').contains('Person in Custody ID: A7646669') // Verify action contains "Person in Custody ID: A7646669"
    cy.get(':nth-child(4) > :nth-child(3)').contains('Case Reference') // Verify table contains "Case Reference"
    cy.wait(3000)
    cy.get('.MuiIconButton-label > :nth-child(1) > [data-testid="tooltip-CM"]').click();
    cy.get('[data-testid="logOutButton"]').click(); // Click on the logout button

    })
    

})