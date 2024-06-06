/// <reference types="cypress"/>
it('NOIPM', () => {

    cy.origin('https://noipm-staging.auth0.com', () => {
    cy.visit('noipm-staging.herokuapp.com')    
    //cy.get('body').tab()
    cy.get('.auth0-lock-input-email > .auth0-lock-input-wrap > .auth0-lock-input').type('vwong@thoughtworks.com')
    cy.get('.auth0-lock-input-show-password > .auth0-lock-input-block > .auth0-lock-input-wrap > .auth0-lock-input').type('Vwong123')
    cy.get('.auth0-lock-submit').click()
    })

    cy.wait(2000)

    cy.origin('https://noipm-staging.herokuapp.com', () => {
    cy.visit('https://noipm-staging.herokuapp.com/cases/1581')

    cy.wait(3000)
    cy.visit('https://noipm-staging.herokuapp.com/cases/1581')
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