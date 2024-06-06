import 'cypress-file-upload';

/// <reference types="cypress"/>
it('NOIPM', () => {

    cy.origin('https://noipm-staging.auth0.com', () => {
    cy.visit('noipm-staging.herokuapp.com')    
    cy.get('.auth0-lock-input-email > .auth0-lock-input-wrap > .auth0-lock-input').type('vwong@thoughtworks.com')
    cy.get('.auth0-lock-input-show-password > .auth0-lock-input-block > .auth0-lock-input-wrap > .auth0-lock-input').type('Vwong123')
    cy.get('.auth0-lock-submit').click()

    })

    cy.wait(4000)

    cy.origin('https://noipm-staging.herokuapp.com', () => {
    cy.get('.MuiIconButton-label > :nth-child(1) > [data-testid="tooltip-VW"]').click();
    cy.get('[data-testid="admin"]').first().click();
    cy.get('[data-testid="pageTitle"]').contains('Admin Portal');
    cy.url().should('eq', 'https://noipm-staging.herokuapp.com/admin-portal');

    cy.get('[data-testid="addSignature"] > .MuiButton-label').click();
    cy.get('.MuiAutocomplete-endAdornment > .MuiButtonBase-root').click();
    cy.get('.MuiAutocomplete-option').contains('vwong@thoughtworks.com').click();
    cy.get('[data-testid="signerName"]').type('VW');
    cy.get('[data-testid="role"]').type('QA');
    cy.get('[data-testid="phoneNumber"]').type('1231231234');
    cy.get('.filepicker').click();
    cy.get('.filepicker').selectFile('cypress/fixtures/test.png', { action: 'drag-drop' });
 
    // cy.fixture('test.png').then(fileContent => {
    //     // Convert binary string to Blob
    //     const blob = Cypress.Blob.binaryStringToBlob(fileContent);
        
    //     // Create a drop event with the Blob
    //     const dropEvent = {
    //       dataTransfer: {
    //         files: [blob],
    //       },
    //     };
      
    //     // Trigger the drop event
    //     cy.get('.filepicker').trigger('drop', dropEvent);
    //   });

    cy.wait(2000)  
    //cy.get('[data-testid="saveButton"]').click();
    
    })
})