describe("template spec", () => {
  it("should visit the public data dashboard", () => {
    cy.visit("https://noipm-ci.herokuapp.com/data");
  });
});
