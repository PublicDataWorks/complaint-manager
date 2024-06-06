import 'cypress-file-upload';

// <reference types="cypress"/>
it('HAWAII', () => {

    cy.origin('https://dev-68895481.okta.com', () => {
    cy.visit('noipm-staging.herokuapp.com')
    cy.wait(2000)
    cy.get('#input28').type('pdm@publicdata.works');
    cy.get('#input36').type('wnc3ubf-hqf-rcr1ZPH');
    cy.get('.button').click();
        
    })

    cy.wait(4000)
    cy.origin('https://noipm-staging.herokuapp.com', () => {
    cy.get('[data-testid="searchField"').type('Smith{enter}');
    cy.get('[data-testid="caseRow1361"] > [data-testid="caseName"]').contains('Smith');
    cy.get('[data-testid="homeButton"]').click();
    cy.get('[data-testid="searchField"]').clear();
    cy.get('[data-testid="searchField"]').type('Smith NOT Jones{enter}');
    cy.wait(2000)
    cy.get('[data-testid="caseRow1361"] > [data-testid="caseName"] > div').should('not.contain', 'Jones');
    cy.get('[data-testid="caseRow1361"] > [data-testid="caseName"]').contains('Smith');
    
    })
})