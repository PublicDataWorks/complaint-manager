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
    cy.get('.MuiIconButton-label > :nth-child(1) > [data-testid="tooltip-CM"]').click();
    cy.get('[data-testid="exports"]').first().click();
    cy.get('[data-testid="ExportAllCasesContainer"]').contains('Export Cases');
    cy.url().should('eq', 'https://noipm-staging.herokuapp.com/export/all');

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