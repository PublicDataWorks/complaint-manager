Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false;
  });

/// <reference types="cypress"/>
it('HAWAIILOGIN', () => {

    cy.origin('https://dev-68895481.okta.com', () => {
    cy.visit('https://hcsoc-staging-0171a859e889.herokuapp.com/')
    cy.wait(2000)
    cy.get('#input28').type('pdm@publicdata.works');
    cy.get('#input36').type('wnc3ubf-hqf-rcr1ZPH');
    cy.get('.button').click();
    
    })

    cy.wait(2000)

    cy.origin('https://hcsoc-staging-0171a859e889.herokuapp.com/', () => {
    cy.get('.MuiIconButton-label > :nth-child(1) > [data-testid="tooltip-CM"]').click();
    cy.get('[data-testid="dataDashboard"]').first().click();
    cy.get('[data-testid="pageTitle"]').contains('Data Dashboard');
    cy.url().should('eq', 'https://hcsoc-staging-0171a859e889.herokuapp.com/dashboard');
    
    })
})