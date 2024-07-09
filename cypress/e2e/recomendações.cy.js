/// <reference types = "cypress"/>

describe('US-012- Funcionalidade: Listar recomendações', () => {
    beforeEach(() => {
      cy.visit('/')
    });

    afterEach(() => {
        cy.screenshot()
      });
    
    it('Deve validar se seção de recomendações está visível', () => {
        cy.get('#recommendations-section').should('be.visible');
    });
    
    it('Deve validar se seção de recomendações está preenchida', () => {
    cy.get('#recommendations').children().should('have.length.greaterThan', 0);
    });

    it('Deve validar que os filhos da seção de recomendações estão sendo atualizados', () => {
        cy.get('#recommendations p').then(($paragraphs) => {
            const initialContents = []
            $paragraphs.each((index, paragraph) => {
                initialContents.push(Cypress.$(paragraph).text())
            })

            cy.reload()

            // Verifica se o conteúdo de cada parágrafo mudou
            cy.get('#recommendations p').each((paragraph, index) => {
                cy.wrap(paragraph).invoke('text').should('not.equal', initialContents[index])
            })
        })
    });
})