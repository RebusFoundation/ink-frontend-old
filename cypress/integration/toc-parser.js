/* eslint-env browser, mocha, chai */
/* global cy, expect */

describe("TOC parser", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.visit("/login", {
      auth: { username: "testuserprofile", password: "devpassword" },
      method: "POST"
    });
  });

  it("converts basic NCX TOC for EPUB 2.0", () => {
    cy.request(
      "/api/parse-toc?toc=%2Fdemo-epub%2Fpg55456-images%2FOEBPS%2Ftoc.ncx"
    ).then(response => {
      const { body } = response;
      expect(body).to.have.property("type", "NCX");
      expect(body).to.have.property("inLanguage", "fr");
      expect(body).to.have.property(
        "heading",
        `Aventures d'Alice au pays des merveilles`
      );
      cy.fixture("toc.json").then(book1 => {
        expect(body).to.deep.equal(book1);
      });
    });
  });

  it("converts basic HTML TOC for EPUB 3.0", () => {
    cy.request(
      "/api/parse-toc?toc=%2Fdemo-epub%2Fchildrens-literature%2FEPUB%2Fnav.xhtml"
    ).then(response => {
      const { body } = response;
      expect(body).to.have.property("heading", "THE CONTENTS");
      expect(body).to.have.property("inLanguage", "en");
      cy.fixture("toc-html.json").then(book1 => {
        expect(body).to.deep.equal(book1);
      });
    });
  });
});
