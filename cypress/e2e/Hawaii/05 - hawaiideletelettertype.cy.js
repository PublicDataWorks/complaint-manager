/// <reference types="cypress"/>
it('HAWAIILOGIN', () => {

    cy.origin('https://dev-68895481.okta.com', () => {
    cy.visit('https://hcsoc-staging-0171a859e889.herokuapp.com/')
    cy.wait(2000)
    cy.get('#input28').type('pdm@publicdata.works');
    cy.get('#input36').type('wnc3ubf-hqf-rcr1ZPH');
    cy.get('.button').click();
    
    })
    cy.wait(4000)
    cy.origin('https://hcsoc-staging-0171a859e889.herokuapp.com/', () => {
    cy.get('.MuiIconButton-label > :nth-child(1) > [data-testid="tooltip-CM"]').click();
    cy.get('[data-testid="admin"]').first().click();
    cy.get('[data-testid="pageTitle"]').contains('Admin Portal');
    cy.url().should('eq', 'https://hcsoc-staging-0171a859e889.herokuapp.com/admin-portal');

    cy.get('[data-testid="letterTypesPanel"] > .MuiButtonBase-root').contains("Test Letter Type")
    cy.get('[data-testid="delete-letter-type-btn"]').contains("Test Letter Type").click();
    cy.get('.MuiDialogContent-root > div > strong').contains('Are you sure you want to permanently delete this letter template?');
    cy.get('.MuiDialogContent-root').contains('By selecting "Yes", you will not be able to generate any new letters using this template. This action will not affect previously generated letters.');
    cy.get('[data-testid="dialog-confirm-button"]').click();
    cy.get('[data-testid="sharedSnackbarBannerText"]').contains('Letter type successfully deleted');
    cy.get('[data-testid="letterTypesPanel"] > .MuiButtonBase-root').should('not.contain', 'Test Letter Type');
})
    
})