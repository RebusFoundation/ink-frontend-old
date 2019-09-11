/* eslint-env browser, mocha, chai */
/* global cy, expect */

describe("Sanitize CSS", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.visit("/login", {
      auth: { username: "testuserprofile", password: "devpassword" },
      method: "POST"
    });
  });

  it("basic CSS sanitisation", () => {
    cy.request(
      "/api/clean-css?css=%2Fdemo-epub%2Fchildrens-literature%2FEPUB%2Fcss%2Fepub.css"
    ).then(response => {
      const { body } = response;
      // expect(body).to.be.ok;
      cy.fixture("epub.css").then(book1 => {
        expect(body).to.equal(book1);
      });
    });
  });
});
