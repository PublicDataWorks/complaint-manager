import 'cypress-file-upload';

/// <reference types="cypress"/>
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
    cy.get('.MuiIconButton-label > :nth-child(1) > [data-testid="tooltip-PD"]').click();
    cy.get('[data-testid="admin"]').first().click();
    cy.get('[data-testid="pageTitle"]').contains('Admin Portal');
    cy.url().should('eq', 'https://noipm-staging.herokuapp.com/admin-portal');

    cy.get('[style="display: flex; align-items: center; justify-content: flex-end; width: 50%; padding: 0px 30px 10px 0px;"] > .MuiButton-containedPrimary').click();
    cy.get('[data-testid="phoneNumber"]').type('1231231244');
    cy.get('[data-testid="saveButton"]').click();
    cy.get(':nth-child(5) > .jss26 > :nth-child(3) > div > [data-testid="Phone Number"]').contains('123-123-1244');
    
    })
})