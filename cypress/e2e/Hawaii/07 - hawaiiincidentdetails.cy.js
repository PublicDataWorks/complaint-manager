Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false;
  });

/// <reference types="cypress"/>
it('HAWAII', () => {

    cy.origin(Cypress.env('url_okta_hawaii'), () => {
    cy.visit(Cypress.env('url_hawaii'))
    cy.wait(2000)
    cy.get('#input28').type(Cypress.env('username_hawaii'), {log: false});
    cy.get('#input36').type(Cypress.env('password_hawaii'), {log: false});
    cy.get('.button').click();
        
    })

    cy.wait(3000)

    cy.origin(Cypress.env('url_hawaii'), () => {

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

    cy.get('[data-testid="back-to-case-link"] > .MuiButton-label').click()

    cy.get('[data-testid="caseStatusBox"]').contains('Initial')

    cy.get('[data-testid="addPersonOnCase"]').contains('Add Complainant').click();
    cy.get('[data-testid="complainant-type-dropdown"]').click();
    cy.get('.MuiAutocomplete-option').contains('Person in Custody').click();
    cy.get('[data-testid="submitEditCivilian"]').click();

    cy.get('.MuiAutocomplete-endAdornment > .MuiButtonBase-root').click()
    cy.get('.MuiAutocomplete-option').contains('Halawa Correctional Facility').click()
    cy.get('[data-testid="inmateSearchSubmitButton"]').click()
    cy.get('[data-testid="A7646669-select-button"]').click()
    cy.get('[data-testid="inmate-submit-button"]').click()
    cy.get('[data-testid="sharedSnackbarBannerText"]').contains('Person in Custody Successfully Added to Case')
    
    cy.get('[data-testid="caseStatusBox"]').contains('Active')

    cy.get('[data-testid="addTagButton"] > .MuiButton-label').click()
    cy.get('.MuiAutocomplete-popupIndicator').click()
    cy.get('.MuiAutocomplete-option').contains('new tag').click()
    cy.get('[data-testid="caseTagSubmitButton"] > .MuiButton-label').click()
    cy.get('[data-testid="caseTagsContainer"]').contains('new tag')

    cy.get('[data-testid="addCaseNoteButton"] > .MuiButton-label').click()
    cy.get('.MuiAutocomplete-popupIndicator').click()
    cy.get('.MuiAutocomplete-option').contains('Contacted NOPD').click()
    cy.get('[data-testid="notesInput"]').type('Test Note');
    cy.get('[data-testid="submitButton"] > .MuiButton-label').click()
    cy.get('[data-testid="caseNotesContainer"]').contains('Test Note')
   // cy.get('[data-testid="firstContactDateLabel"]').contains('First Contact OIPM')
    cy.wait(4000) 
    
    cy.get('[data-testid="narrativeSummaryInput"]').type('Test Narrative Summary');
    cy.get('.ql-editor').type('Test Narrative Description');

    cy.get('[data-testid="addPersonOnCase"]').contains('Add Witness').click();
    cy.get('[data-testid="complainant-type-dropdown"]').click();
    cy.get('.MuiAutocomplete-option').contains('Person in Custody').click();
    cy.get('[data-testid="submitEditCivilian"]').click();
    cy.get('[data-testid="facility-input"]').click();
    cy.get('.MuiAutocomplete-option').contains('Halawa Correctional Facility').click();
    cy.get('[data-testid="inmateSearchSubmitButton"]').click()
    cy.get('[data-testid="A1734442-select-button"] > .MuiButton-label').click();
    cy.get('[data-testid="inmate-submit-button"]').click();
    
    cy.get('[data-testid="addPersonOnCase"]').eq(2).click();
    cy.get('[data-testid="complainant-type-dropdown"]').click();
    cy.get('.MuiAutocomplete-option').contains('Person in Custody').click();
    cy.get('[data-testid="submitEditCivilian"]').click();
    cy.get('[data-testid="facility-input"]').click();
    cy.get('.MuiAutocomplete-option').contains('Halawa Correctional Facility').click();
    cy.get('[data-testid="inmateSearchSubmitButton"]').click()
    cy.get('[data-testid="A5991278-select-button"] > .MuiButton-label').click();
    cy.get('[data-testid="inmate-submit-button"]').click();

    cy.get('[data-testid="generate-letter-button"]').click();
    cy.get('[data-testid="Food Response-option"]').click();

    cy.wait(3000)

    cy.get('.MuiCardContent-root').contains('Food Services')
    cy.get('[data-testid="edit-confirmation-dialog-button"]').click()
    cy.get('[data-testid="edit-letter-button"]').click()
    cy.get('.ql-editor > :nth-child(1)').type('!')
    cy.get('[data-testid="save-button"]').click();

    cy.get('.MuiCardContent-root').contains('!')

    cy.get('[data-testid="download-letter-as-pdf"]').click();

    cy.get('[data-testid="generate-letter-button"]').click()

    cy.wait(3000)

    cy.get('[data-testid="attachmentDescription"]').contains('Food Response')
    cy.get('[data-testid="attachmentName"]').click()

    })
})