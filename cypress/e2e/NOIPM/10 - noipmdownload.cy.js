Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false;
});

/// <reference types="cypress"/>
it('NOIPM', () => {

    cy.origin(Cypress.env('url_auth0_noipm'), () => {
    cy.visit(Cypress.env('url_noipm'))    
    //cy.get('body').tab()
    cy.get('.auth0-lock-input-email > .auth0-lock-input-wrap > .auth0-lock-input').type(Cypress.env('username_noipm'), {log: false})
    cy.get('.auth0-lock-input-show-password > .auth0-lock-input-block > .auth0-lock-input-wrap > .auth0-lock-input').type(Cypress.env('password_noipm'), {log: false})
    })

    cy.wait(2000)

    cy.origin(Cypress.env('url_noipm'), () => {
    cy.visit('https://noipm-staging.herokuapp.com/cases/1347')

    cy.wait(3000)
    cy.visit('https://noipm-staging.herokuapp.com/cases/1347')
    cy.window().document().then(function (doc) {
        doc.addEventListener('click', () => {
          setTimeout(function () {
            if (doc.location) {
              doc.location.reload();
            }
          }, 5000)
        })
        cy.get('[data-testid="attachmentName"]').eq(0).click();
    })
    cy.wait(5000)
    cy.get('[data-testid="attachmentName"]').eq(1).click();

    })
  })