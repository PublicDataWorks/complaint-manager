import "cypress-file-upload";

Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false;
  });

/// <reference types="cypress"/>
it('HAWAII', () => {

  cy.origin('https://dev-68895481.okta.com/', () => {
  cy.visit(Cypress.env('url_hawaii'))
  cy.wait(2000)
  cy.get('#input28').type(Cypress.env('username_hawaii'), {log: false});
  cy.get('#input36').type(Cypress.env('password_hawaii'), {log: false});
  cy.get('.button').click();
      
  })

    cy.wait(4000)

    cy.origin(Cypress.env('url_hawaii'), () => {
    Cypress.require("/cypress/support/commands.js");
    cy.get('.MuiIconButton-label > :nth-child(1) > [data-testid="tooltip-CM"]').click();
    cy.get('[data-testid="admin"]').first().click();
    cy.get('[data-testid="pageTitle"]').contains('Admin Portal');

    cy.get('[data-testid="addSignature"] > .MuiButton-label').click();
    cy.get('[data-testid="user"]').type("{downarrow}{enter}");
    cy.get('[data-testid="signerName"]').type('VW');
    cy.get('[data-testid="role"]').type('QA');
    cy.get('[data-testid="phoneNumber"]').type('1231231234');
    cy.get(".filepicker").click(); // Click on the dropzone area
    cy.get('.filepicker').attachFile("test.png", {
      subjectType: "drag-n-drop"
  });
    
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
    cy.get('[data-testid="saveButton"]').click();
    
    })
})