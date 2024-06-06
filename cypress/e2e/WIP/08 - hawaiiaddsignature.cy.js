import 'cypress-file-upload';

/// <reference types="cypress"/>
it('HAWAII', () => {

  cy.origin('https://dev-68895481.okta.com', () => {
  cy.visit('noipm-staging.herokuapp.com')
  cy.wait(2000)
  cy.get('#input28').type('pdm@publicdata.works');
  cy.get('#input36').type('wnc3ubf-hqf-rcr1ZPH');
  cy.get('.button').click();
      
  })

    cy.wait(4000)

    cy.origin('https://noipm-staging.herokuapp.com', () => {
    cy.get('.MuiIconButton-label > :nth-child(1) > [data-testid="tooltip-PD"]').click();
    cy.get('[data-testid="admin"]').first().click();
    cy.get('[data-testid="pageTitle"]').contains('Admin Portal');
    cy.url().should('eq', 'https://noipm-staging.herokuapp.com/admin-portal');

    cy.get('[data-testid="addSignature"] > .MuiButton-label').click();
    cy.get('.MuiAutocomplete-endAdornment > .MuiButtonBase-root').click();
    cy.get('.MuiAutocomplete-option').contains('pdm@publicdata.works').click();
    cy.get('[data-testid="signerName"]').type('VW');
    cy.get('[data-testid="role"]').type('QA');
    cy.get('[data-testid="phoneNumber"]').type('1231231234');
    cy.get('.filepicker').click();
    cy.get('input[type=file]')
      .selectFile('cypress/fixtures/test.png', { force: true })
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