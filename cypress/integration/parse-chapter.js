/* eslint-env browser, mocha, chai */
/* global cy, expect */

describe("Sanitize and parse chapter", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.visit("/login", {
      auth: { username: "testuserprofile", password: "devpassword" },
      method: "POST"
    });
  });

  it("Chapter parsing and sanitisation", () => {
    cy.request(
      "/api/parse-chapter?chapter=%2Fdemo-epub%2Fpg55456-images%2FOEBPS%2F%40public%40vhost%40g%40gutenberg%40html%40files%4055456%4055456-h%4055456-h-1.htm.xhtml&index=1"
    ).then(response => {
      const { body } = response;
      expect(body).to.have.property("html");
      cy.fixture("epub.html.json").then(book1 => {
        expect(body).to.deep.equal(book1);
      });
    });
  });
});
