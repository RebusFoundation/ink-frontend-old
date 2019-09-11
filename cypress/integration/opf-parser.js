/* eslint-env browser, mocha, chai */
/* global cy, expect */

describe("OPF parser", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.visit("/login", {
      auth: { username: "testuserprofile", password: "devpassword" },
      method: "POST"
    });
  });

  it("converts basic OPF for EPUB 2.0", () => {
    cy.request(
      "/api/parse-opf?opf=%2Fdemo-epub%2Fpg55456-images%2FOEBPS%2Fcontent.opf"
    ).then(response => {
      const { body } = response;
      expect(body).to.have.property("inLanguage", "fr");
      expect(body).to.have.property(
        "name",
        `Aventures d'Alice au pays des merveilles`
      );
      cy.fixture("pg55456-images.json").then(book1 => {
        expect(body).to.deep.equal(book1);
      });
    });
  });

  it("converts basic OPF for EPUB 3.0", () => {
    cy.request(
      "/api/parse-opf?opf=http%3A%2F%2Flocalhost%3A3000%2Fdemo-epub%2Fmoby-dick%2FOPS%2Fpackage.opf"
    ).then(response => {
      const { body } = response;
      expect(body).to.have.property("name", "Moby-Dick");
      expect(body.json).to.have.property("epubVersion", "3.0");
      cy.fixture("moby-dick.json").then(book1 => {
        expect(body).to.deep.equal(book1);
      });
    });
  });

  it("converts basic OPF for EPUB 2.0 directly from id", () => {
    cy.request("/api/id-to-opf?id=%2Fbook2.json").then(response => {
      const { body } = response;
      expect(body).to.have.property("inLanguage", "fr");
      expect(body).to.have.property(
        "name",
        `Aventures d'Alice au pays des merveilles`
      );
      cy.fixture("pg55456-images.json").then(book1 => {
        expect(body).to.deep.equal(book1);
      });
    });
  });
});
