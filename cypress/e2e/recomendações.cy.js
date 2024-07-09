/// <reference types = "cypress"/>

describe('US-012', () => {
    beforeEach(() => {
      cy.visit('/')
    });

    afterEach(() => {
        cy.screenshot()
      });
    
    it('Valida se seção de recomendações está visível', () => {
        cy.get('#recommendations-section').should('be.visible');
    });
    
    it('Valida se seção de recomendações está preenchida', () => {
    cy.get('#recommendations').children().should('have.length.greaterThan', 0);
    });

    it('Valida atualização das recomendações', () => {
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