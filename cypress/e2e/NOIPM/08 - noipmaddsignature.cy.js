import "cypress-file-upload";

Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false;
  });

/// <reference types="cypress"/>
it('NOIPM', () => {

    cy.origin(Cypress.env('url_auth0_noipm'), () => {
    cy.visit(Cypress.env('url_noipm'))    
    cy.get('.auth0-lock-input-email > .auth0-lock-input-wrap > .auth0-lock-input').type(Cypress.env('username_noipm'), {log: false})
    cy.get('.auth0-lock-input-show-password > .auth0-lock-input-block > .auth0-lock-input-wrap > .auth0-lock-input').type(Cypress.env('password_noipm'), {log: false})
    cy.get('.auth0-lock-submit').click()

    });

    cy.wait(4000)

    cy.origin(Cypress.env('url_noipm'), () => {
    Cypress.require("/cypress/support/commands.js");
    cy.get('.MuiIconButton-label > :nth-child(1) > [data-testid="tooltip-VW"]').click();
    cy.get('[data-testid="admin"]').first().click();
    cy.get('[data-testid="pageTitle"]').contains('Admin Portal');

    //cy.get('.MuiIconButton-label > :nth-child(1) > [data-testid="tooltip-V"]').click();
    //cy.get('[data-testid="admin"]').first().click();
    cy.get('[data-testid="addSignature"]').click()
    cy.get('[data-testid="user"]').type("{downarrow}{enter}");
    cy.get('[data-testid="signerName"]').type('VW');
    cy.get('[data-testid="role"]').type('QA');
    cy.get('[data-testid="phoneNumber"]').type('1231231234');
    cy.get('.filepicker').click(); // Click on the dropzone area
    cy.get('.filepicker').attachFile("test.png", {
        subjectType: "drag-n-drop"
    }); // Attaches the file from the fixtures folder
 
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