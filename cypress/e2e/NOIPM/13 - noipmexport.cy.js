Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false;
});

/// <reference types="cypress"/>
it('NOIPM', () => { // Login

    cy.origin(Cypress.env('url_auth0_noipm'), () => {
    cy.visit(Cypress.env('url_noipm'))    
    cy.get('.auth0-lock-input-email > .auth0-lock-input-wrap > .auth0-lock-input').type(Cypress.env('username_noipm'), {log: false})
    cy.get('.auth0-lock-input-show-password > .auth0-lock-input-block > .auth0-lock-input-wrap > .auth0-lock-input').type(Cypress.env('password_noipm'), {log: false})
    cy.get('.auth0-lock-submit').click()
    })

    cy.wait(2000)

    cy.origin(Cypress.env('url_noipm'), () => { // Navigating to Export page
    cy.get('.MuiIconButton-label > :nth-child(1) > [data-testid="tooltip-VW"]').click();
    cy.get('[data-testid="exports"]').first().click();
    cy.get('[data-testid="ExportAllCasesContainer"]').contains('Export Cases');

    cy.window().document().then(function (doc) { // Refreshes page after initial download below
        doc.addEventListener('click', () => {
          setTimeout(function () {
            if (doc.location) {
              doc.location.reload();
            }
          }, 5000)
    })

    cy.get('[data-testid="exportCasesFromInput"]').type('2024-05-20'); // Select from date
    cy.get('[data-testid="exportCasesToInput"]').type('2024-05-20'); // Select to date
    cy.get('[data-testid="exportRangedCases"]').click(); // Click on Export Selected Cases button
    cy.get('[data-testid="exportAuditLogButton"]').click(); // Click Export

    })

    cy.wait(4000)

    cy.get('[data-testid="exportAuditLogFromInput"]').type('2024-05-20'); // Select from date
    cy.get('[data-testid="exportAuditLogToInput"]').type('2024-05-20'); // Select to date
    cy.get('[data-testid="exportRangedAudits"]').click(); // Click on Export Selected Audit Log button
    cy.get('[data-testid="exportAuditLogButton"]').click(); // Click Export
    
    })
})