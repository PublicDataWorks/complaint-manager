Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false;
  });

/// <reference types="cypress"/>
it('HAWAIILOGIN', () => {

    cy.origin(Cypress.env('url_okta_hawaii'), () => {
    cy.visit(Cypress.env('url_hawaii'))
    cy.wait(2000)
    cy.get('#input28').type(Cypress.env('username_hawaii'), {log: false});
    cy.get('#input36').type(Cypress.env('password_hawaii'), {log: false});
    cy.get('.button').click();
    
    })

    cy.wait(4000)

    cy.origin(Cypress.env('url_hawaii'), () => {

    cy.visit('https://hcsoc-staging-0171a859e889.herokuapp.com/cases/34')
    cy.get('[data-testid="archiveCaseButton"]').click()
    cy.get('[data-testid="dialog-confirm-button"]').click()
    cy.get('[data-testid="sharedSnackbarBannerText"]').contains('Case was successfully archived')
    cy.visit('https://hcsoc-staging-0171a859e889.herokuapp.com/cases/34')
    cy.get('[data-testid="letterStatusMessage"]').contains('This case has been archived. Changes to some case details and letter flow are not allowed while case is archived.')
    
    cy.get('[data-testid="addPersonOnCase"]').should('not.exist')

    cy.get('[data-testid="restoreCaseButton"] > .MuiButton-label').click()
    cy.get('[data-testid="confirmRestoreArchivedCase"] > .MuiButton-label').click()
    cy.get('[data-testid="sharedSnackbarBannerText"]').contains('Case was successfully restored')
    // cy.get('[data-testid="letterStatusMessage"]').contains('The referral letter has been approved. Any changes made to the case details will not be reflected in the letter.')
    cy.get('[data-testid="addPersonOnCase"]').should('exist')

    // cy.get('[data-testid="addCaseNoteButton"] > .MuiButton-label').click()
    // cy.get('.MuiAutocomplete-popupIndicator').click()
    // cy.get('.MuiAutocomplete-option').contains('Contacted NOPD').click()
    // cy.get('[data-testid="notesInput"]').type('Test Note');
    // cy.get('[data-testid="submitButton"] > .MuiButton-label').click()
    // cy.get('[data-testid="caseNotesContainer"]').contains('Test Note')

    // cy.get('[style="margin: 0px 24px;"] > [style="display: flex;"] > .MuiButtonBase-root > .MuiButton-label').click()
    // cy.get('.MuiTableBody-root > :nth-child(2) > :nth-child(3)').contains('Tag Name: new tag')
    // cy.get('.MuiTableBody-root > :nth-child(1) > :nth-child(3)').contains('Action: Contacted NOPD')

    })

})
    