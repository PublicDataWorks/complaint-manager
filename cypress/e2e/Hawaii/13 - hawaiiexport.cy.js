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
    cy.get('.MuiIconButton-label > :nth-child(1) > [data-testid="tooltip-CM"]').click();
    cy.get('[data-testid="exports"]').first().click();
    cy.get('[data-testid="ExportAllCasesContainer"]').contains('Export Cases');

    cy.window().document().then(function (doc) {
        doc.addEventListener('click', () => {
          setTimeout(function () {
            if (doc.location) {
              doc.location.reload();
            }
          }, 7000)
        })
    cy.get('[data-testid="exportCasesFromInput"]').type('2024-05-10');
    cy.get('[data-testid="exportCasesToInput"]').type('2024-05-13');
    cy.get('[data-testid="exportRangedCases"]').click();
    cy.get('[data-testid="exportAuditLogButton"]').click();
})

cy.wait(4000)

    cy.get('[data-testid="exportAuditLogFromInput"]').type('2024-05-20');
    cy.get('[data-testid="exportAuditLogToInput"]').type('2024-05-20');
    cy.get('[data-testid="exportRangedAudits"]').click();
    cy.get('[data-testid="exportAuditLogButton"]').click();

     })  
   })