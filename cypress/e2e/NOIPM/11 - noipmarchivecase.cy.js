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

    cy.visit('https://noipm-staging.herokuapp.com/cases/1560')
    cy.get('[data-testid="archiveCaseButton"]').click()
    cy.get('[data-testid="dialog-confirm-button"]').click()
    cy.get('[data-testid="sharedSnackbarBannerText"]').contains('Case was successfully archived')
    cy.visit('https://noipm-staging.herokuapp.com/cases/1560')
    cy.get('[data-testid="letterStatusMessage"]').contains('This case has been archived. Changes to some case details and letter flow are not allowed while case is archived.')
    
    cy.get('[data-testid="addPersonOnCase"]').should('not.exist')
    cy.get('[data-testid="addAccusedMenu"]').should('not.exist')

    cy.get('[data-testid="restoreCaseButton"] > .MuiButton-label').click()
    cy.get('[data-testid="confirmRestoreArchivedCase"] > .MuiButton-label').click()
    cy.get('[data-testid="sharedSnackbarBannerText"]').contains('Case was successfully restored')
    cy.get('[data-testid="letterStatusMessage"]').contains('The referral letter has been approved. Any changes made to the case details will not be reflected in the letter.')
    cy.get('[data-testid="addPersonOnCase"]').should('exist')
    cy.get('[data-testid="addAccusedMenu"]').should('exist')
    
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
    