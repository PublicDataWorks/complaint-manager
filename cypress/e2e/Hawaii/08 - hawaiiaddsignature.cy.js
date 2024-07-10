import 'cypress-file-upload';

import "cypress-file-upload";

Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false;
  });

/// <reference types="cypress"/>
it("HAWAII", () => {
  cy.origin("https://dev-68895481.okta.com", () => {
    cy.visit("https://hcsoc-ci-b16ff838b089.herokuapp.com/");
    cy.wait(2000);
    cy.get("#input28").type("pdm@publicdata.works");
    cy.get("#input36").type("wnc3ubf-hqf-rcr1ZPH");
    cy.get(".button").click();
  });

  cy.origin('https://dev-68895481.okta.com/', () => {
  cy.visit('https://hcsoc-staging-0171a859e889.herokuapp.com/')
  cy.wait(2000)
  cy.get('#input28').type('pdm@publicdata.works');
  cy.get('#input36').type('wnc3ubf-hqf-rcr1ZPH');
  cy.get('.button').click();
      
  })

    cy.wait(4000)

    cy.origin('https://hcsoc-staging-0171a859e889.herokuapp.com/', () => {
    Cypress.require("/cypress/support/commands.js");
    cy.get('.MuiIconButton-label > :nth-child(1) > [data-testid="tooltip-CM"]').click();
    cy.get('[data-testid="admin"]').first().click();
    cy.get('[data-testid="pageTitle"]').contains('Admin Portal');
    cy.url().should('eq', 'https://hcsoc-staging-0171a859e889.herokuapp.com/admin-portal');

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

    // Add user info
    cy.get('[data-testid="user"]').type("pdm{downarrow}{enter}");
    cy.get('[data-testid="signerName"]').type("Test");
    cy.get('[data-testid="role"]').type("QA");
    cy.get('[data-testid="phoneNumber"]').type("1231231234");

    cy.wait(2000)  
    cy.get('[data-testid="saveButton"]').click();
    
    })
})
