import * as navegacao from '../modules/navegacao'
import * as catalogo from '../modules/catalogo'

describe('Produtos', () => {
  beforeEach(() => {
    navegacao.abrirHome()
    navegacao.abrirProdutos()
    cy.location('pathname').should('eq', '/products')
    cy.contains('h2.title', 'All Products').should('be.visible')
  })

  it('TC8 - deve exibir a lista de produtos e os detalhes do primeiro produto', () => {
    catalogo.cardsDeProduto().should('have.length.greaterThan', 0).first().should('be.visible')

    catalogo.nomesDosProdutos().first().invoke('text').then((nomeNaLista) => {
      catalogo.abrirDetalheDoPrimeiroProduto()

      cy.location('pathname').should('match', /^\/product_details\/\d+$/)
      catalogo.detalheDoProduto().within(() => {
        cy.get('h2').should('be.visible').and('have.text', nomeNaLista.trim())
        cy.contains('p', /^Category: \S+/).should('be.visible')
        cy.contains('span', /^Rs\. \d+$/).should('be.visible')
        cy.contains('p', /^Availability: \S+/).should('be.visible')
        cy.contains('p', /^Condition: \S+/).should('be.visible')
        cy.contains('p', /^Brand: \S+/).should('be.visible')
      })
    })
  })

  it('TC9 - deve exibir todos os produtos relacionados ao termo buscado', () => {
    cy.fixture('produtos').then(({ termoBusca }) => {
      catalogo.buscarProduto(termoBusca)

      cy.location('search').should('eq', `?search=${termoBusca}`)
      cy.contains('h2.title', 'Searched Products').should('be.visible')

      // A busca da aplicação relaciona o termo ao nome OU à categoria do produto,
      // e a categoria não aparece no card. Por isso a API de busca serve de oráculo:
      // cada item dela precisa estar relacionado ao termo, e a tela precisa exibir exatamente esses itens.
      cy.buscarProdutosViaApi(termoBusca).then((produtosEsperados) => {
        const termo = termoBusca.toLowerCase()
        expect(produtosEsperados, 'produtos retornados pela API').to.not.be.empty
        produtosEsperados.forEach(({ name, category }) => {
          const relacionado = name.toLowerCase().includes(termo) || category.category.toLowerCase().includes(termo)
          expect(relacionado, `"${name}" (${category.category}) relacionado a "${termoBusca}"`).to.be.true
        })

        catalogo.cardsDeProduto().should('have.length', produtosEsperados.length)
        catalogo.nomesDosProdutos().then(($nomes) => {
          const nomesNaTela = $nomes.toArray().map((nome) => nome.innerText.trim()).sort()
          expect(nomesNaTela).to.deep.equal(produtosEsperados.map(({ name }) => name).sort())
        })
        catalogo.cardsDeProduto().each(($card) => {
          cy.wrap($card).should('be.visible')
        })
      })
    })
  })
})
