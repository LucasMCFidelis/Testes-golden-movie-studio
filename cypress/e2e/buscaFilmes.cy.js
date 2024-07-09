/// <reference types = "cypress"/>

describe('US-015- Funcionalidade: Buscar filmes', () => {
  beforeEach(() => {
    cy.visit('/')
  });
  
  afterEach(() => {
    cy.screenshot()
  });

  const filmeExistente = 'Matrix';
  const filmeInexistente = ' ';
  
  it('Deve realizar a busca de um filme valido', () => {
    cy.buscarFilme(filmeExistente)
    cy.get('#results-section').should('contain', filmeExistente)
  });
  
  it('Deve realizar a busca de um filme não existente', () => {
    cy.buscarFilme(filmeInexistente)
    cy.get('#results-section > p').should('contain', 'Filme não encontrado.')
    
  });

  it('Deve limpar o campo de busca', () => {
    cy.get('#search-input').type(filmeExistente)
    cy.get('#clear-button').click()
    cy.get('#results-section > p').should(($p) => {
      expect($p.text().trim()).to.be.empty; // Verifica se o texto está vazio
    });
  });
})