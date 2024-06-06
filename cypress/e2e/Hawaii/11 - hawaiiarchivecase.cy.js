/// <reference types="cypress"/>
it('HAWAIILOGIN', () => {

    cy.origin('https://dev-68895481.okta.com', () => {
    cy.visit('noipm-staging.herokuapp.com')
    cy.wait(2000)
    cy.get('#input28').type('pdm@publicdata.works');
    cy.get('#input36').type('wnc3ubf-hqf-rcr1ZPH');
    cy.get('.button').click();
    
    })

    cy.wait(4000)

    cy.origin('https://noipm-staging.herokuapp.com', () => {

    cy.visit('https://noipm-staging.herokuapp.com/cases/1631')
    cy.get('[data-testid="archiveCaseButton"]').click()
    cy.get('[data-testid="dialog-confirm-button"]').click()
    cy.get('[data-testid="sharedSnackbarBannerText"]').contains('Case was successfully archived')
    cy.visit('https://noipm-staging.herokuapp.com/cases/1631')
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
    