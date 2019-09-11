/* eslint-env browser, mocha, chai */
/* global cy */

describe("Sign In and Profile Creation", () => {
  beforeEach(() => {
    cy.visit("/logout", { method: "POST" });
    cy.visit("/");
  });
  afterEach(() => {
    cy.visit("/logout", { method: "POST" });
  });

  it("Shows a login page and profile after login", () => {
    console.log(
      "testusernoprofile" + Math.floor(Math.random() * 10000000000000)
    );
    cy.contains("Sign in to use the platform.");
    cy.visit("/login", {
      auth: {
        username: "testusernoprofile" + Math.random().toString(36),
        password: "devpassword"
      },
      method: "POST"
    });
    cy.contains("Do you want to create a Rebus Ink account?");
  });

  it("Let's you create a profile", () => {
    cy.contains("Sign in to use the platform.");
    cy.visit("/login", {
      auth: {
        username: "testuser" + Math.floor(Math.random() * 10000000000000),
        password: "devpassword"
      },
      method: "POST"
    });
    cy.contains("Yes, create an account").click();
    cy.contains("Drop file here");
  });
});
