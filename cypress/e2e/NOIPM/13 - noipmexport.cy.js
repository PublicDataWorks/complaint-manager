Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false;
});

/// <reference types="cypress"/>
it('NOIPM', () => {

    cy.origin('https://noipm-staging.auth0.com', () => {
    cy.visit('https://noipm-staging.herokuapp.com')    
    //cy.get('body').tab()
    cy.get('.auth0-lock-input-email > .auth0-lock-input-wrap > .auth0-lock-input').type('vwong@thoughtworks.com')
    cy.get('.auth0-lock-input-show-password > .auth0-lock-input-block > .auth0-lock-input-wrap > .auth0-lock-input').type('Vwong123')
    cy.get('.auth0-lock-submit').click()
    })

    cy.wait(2000)

    cy.origin('https://noipm-staging.herokuapp.com', () => {
    cy.get('.MuiIconButton-label > :nth-child(1) > [data-testid="tooltip-VW"]').click();
    cy.get('[data-testid="exports"]').first().click();
    cy.get('[data-testid="ExportAllCasesContainer"]').contains('Export Cases');
    cy.url().should('eq', 'https://noipm-staging.herokuapp.com/export/all');

    cy.window().document().then(function (doc) {
        doc.addEventListener('click', () => {
          setTimeout(function () {
            if (doc.location) {
              doc.location.reload();
            }
          }, 5000)
    })

    cy.get('[data-testid="exportCasesFromInput"]').type('2024-05-20');
    cy.get('[data-testid="exportCasesToInput"]').type('2024-05-20');
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