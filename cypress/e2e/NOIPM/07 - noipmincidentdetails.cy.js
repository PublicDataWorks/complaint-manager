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

    cy.wait(6000)

    cy.origin('https://noipm-staging.herokuapp.com', () => {

    cy.get('[data-testid="createCaseButton"]').click() //Click create case
    cy.get('[data-testid="createCaseDialogTitle"] > .MuiTypography-root').contains('Create New Case') //Check dialogue title appears

    cy.get('[data-testid="createAndView"] > .MuiButton-label').click() //Click Create and View
    cy.wait(2000)
    cy.get('[data-testid="firstNameField"] > .MuiFormHelperText-root').contains('Please enter First Name') //Error messages
    cy.get('[data-testid="lastNameField"] > .MuiFormHelperText-root').contains('Please enter Last Name') //Error messages
    cy.get('[data-testid="intakeSourceInput"]').click() //Click on dropdown
    cy.get('.MuiAutocomplete-option').contains('Email').click() //Check dropdown option contains "Email" and clicks option
    cy.get('[data-testid="firstNameInput"]').type('TestCypressFirst') //Input first name
    cy.get('[data-testid="lastNameInput"]').type('TestCypressLast') //Input last name
    cy.get('[data-testid="createAndView"] > .MuiButton-label').click() //Click create and view
    cy.get('[data-testid="phoneNumberInput"]').type('1231231234') //Enter phone number
    cy.get('[data-testid="createAndView"] > .MuiButton-label').click() //Click Create and View
   // cy.get('[data-testid="firstContactDateLabel"]').contains('First Contact OIPM')
    cy.wait(4000) 

    cy.get('[data-testid="caseStatusBox"]').contains('Initial')
    
    cy.get('[data-testid="narrativeSummaryInput"]').type('Test Narrative Summary');
    cy.wait(1000)
    cy.get('.ql-editor').type('Test Narrative Description');

    cy.get('[data-testid="addPersonOnCase"]').contains('Add Witness').click();
    cy.get('[data-testid="addOfficerPersonOnCase"]').click();
    cy.get('.MuiAutocomplete-endAdornment > .MuiButtonBase-root').click();
    cy.get('.MuiAutocomplete-option').contains('1st District').click()
    cy.get('[data-testid="officerSearchSubmitButton"]').click();
    cy.get('[data-testid="selectNewOfficerButton"]').first().click();
    cy.get('[data-testid="officerSubmitButton"] > .MuiButton-label').click();
    cy.get('[data-testid="OfficerFullName"]').contains('Mauricio Z Abshire');

    cy.get('[data-testid="addAccusedMenu"]').contains('Add Accused').click();
    cy.get('[data-testid="addAccusedCivilian Within NOPD"]').click();
    cy.get('.MuiAutocomplete-endAdornment > .MuiButtonBase-root').click();
    cy.get('.MuiAutocomplete-option').contains('2nd District').click();    
    cy.get('[data-testid="officerSearchSubmitButton"]').click();
    cy.get('[data-testid="selectNewOfficerButton"]').first().click();
    cy.get('[data-testid="officerSubmitButton"] > .MuiButton-label').click();
    cy.get('[data-testid="Civilian (NOPD)FullName"]').contains('Gideon B Abshire');

    cy.get('[data-testid="caseStatusBox"]').contains('Active')

    cy.get('[data-testid="update-status-button"]').click();
    cy.get('[data-testid="update-case-status-button"]').click();
    cy.wait(2000)
    cy.go('back');
    cy.wait(2000)
    cy.get('[data-testid="caseStatusBox"]').contains('Letter in Progress')
    cy.wait(2000)
    cy.go('forward');
    cy.get('[data-testid="Civilian Name"]').contains('TestCypressFirst TestCypressLast');
    cy.get('[data-testid="Cell Phone"]').contains('(123) 123-1234');
    cy.get('[data-testid="Officer Name"]').contains('Mauricio Z Abshire');
    cy.get(':nth-child(6) > [data-testid="caseDetailCard"] > [data-testid="caseDetailCardItem"] > [data-testid="District"]').contains('1st District');
    cy.get('[data-testid="Civilian (NOPD) Name"]').contains('Gideon B Abshire');
    cy.get('[data-testid="next-button"]').click();

    cy.get('[data-testid="letterOfficers[0]-option-1"]').click();
    cy.get('[data-testid="next-button"]').click();

    cy.get('[data-testid="include-retaliation-concerns-field"]').click()
    cy.get('[data-testid="use-of-force"]').click()
    cy.get('[data-testid="serious-misconduct"]').click()
    cy.get('[data-testid="letterOfficers[0]-1"]').click()
    cy.get('[data-testid="next-button"]').click();
    
    cy.wait(5000)

    //cy.get('[data-testid="sharedSnackbarBannerText"]').contains('Recommended actions were successfully updated')
    cy.get('.letter-preview').contains('Name: TestCypressFirst TestCypressLast')
    cy.get('.letter-preview').contains('Phone: (123) 123-1234')
   
    cy.get('.letter-preview').contains('Name: Gideon B Abshire')
    cy.get('.letter-preview').contains('Employee ID: #29281')
    cy.get('.letter-preview').contains('District: 2nd District')

    cy.get('.letter-preview').contains('Name: Mauricio Z Abshire')
    cy.get('.letter-preview').contains('Employee ID: #20447')
    cy.get('.letter-preview').contains('District: 1st District')

    cy.get('.letter-preview').contains('Test Narrative Description')

    cy.get('.letter-preview').contains('Be temporarily or permanently reassigned from his/her current assignment')

    cy.get('.letter-preview').contains('Use of Force')
    cy.get('.letter-preview').contains('Serious Misconduct')

    cy.wait(5000)

    cy.get('[data-testid="edit-confirmation-dialog-button"]').click();
    cy.get('[data-testid="edit-letter-button"]').click();

    cy.get('.ql-editor > :nth-child(9)').type('!');
    cy.get('[data-testid="save-button"]').click();

    cy.get('.letter-preview').contains('Name: TestCypressFirst TestCypressLast!')

    cy.get('[data-testid="download-letter-as-pdf"]').click();

    cy.get('[data-testid="submit-for-review-button"]').click();
    cy.get('[data-testid="update-case-status-button"]').click();

    cy.get('[data-testid="caseStatusBox"]').contains('Ready for Review')

    //cy.get('[data-testid="sharedSnackbarBannerText"]').contains('Case was successfully updated')
    cy.get('[data-testid="review-and-approve-letter-button"]').click();

    cy.wait(3000)

    cy.get('.MuiCardContent-root').contains('TestCypressFirst TestCypressLast!')
    cy.get('.MuiCardContent-root').contains('Phone: (123) 123-1234')
    cy.get('.MuiCardContent-root').contains('Name: Gideon B Abshire')
    cy.get('.MuiCardContent-root').contains('Employee ID: #29281')
    cy.get('.MuiCardContent-root').contains('District: 2nd District')

    cy.get('.MuiCardContent-root').contains('Name: Mauricio Z Abshire')
    cy.get('.MuiCardContent-root').contains('Employee ID: #20447')
    cy.get('.MuiCardContent-root').contains('District: 1st District')

    cy.get('.MuiCardContent-root').contains('Test Narrative Description')

    cy.get('.MuiCardContent-root').contains('Be temporarily or permanently reassigned from his/her current assignment')

    cy.get('.MuiCardContent-root').contains('Use of Force')
    cy.get('.MuiCardContent-root').contains('Serious Misconduct')

    cy.get('[data-testid="approve-letter-button"]').click();
    cy.get('[data-testid="update-case-status-button"]').click();
    cy.get('[data-testid="sharedSnackbarBannerText"]').contains('Status was successfully updated')
    cy.get('[data-testid="letterStatusMessage"]').contains('The referral letter has been approved. Any changes made to the case details will not be reflected in the letter.')
    cy.get('[data-testid="caseStatusBox"]').contains('Forwarded to Agency')
    cy.get('[data-testid="update-status-button"]').click();
    cy.get('[data-testid="update-case-status-button"]').click();
    cy.get('[data-testid="caseStatusBox"]').contains('Closed')

    cy.get('[data-testid="attachmentDescription"]').eq(0).contains('Letter to Complainant')
    cy.get('[data-testid="attachmentDescription"]').eq(1).contains('Referral Letter')
    cy.window().document().then(function (doc) {
        doc.addEventListener('click', () => {
          setTimeout(function () {
            if (doc.location) {
              doc.location.reload();
            }
          }, 5000)
        })
        cy.get('[data-testid="attachmentName"]').eq(0).click();
    })

    cy.wait(2000)
    cy.get('[data-testid="attachmentName"]').eq(1).click()
    })
})