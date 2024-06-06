/// <reference types="cypress"/>
it('HAWAIILOGIN', () => {

    cy.origin('https://dev-68895481.okta.com', () => {
    cy.visit('noipm-staging.herokuapp.com')
    cy.wait(2000)
    cy.get('#input28').type('pdm@publicdata.works');
    cy.get('#input36').type('wnc3ubf-hqf-rcr1ZPH');
    cy.get('.button').click();
   
    })

    cy.origin('https://noipm-staging.herokuapp.com', () => {

    cy.url().should('eq', 'https://noipm-staging.herokuapp.com/callback');
})
})