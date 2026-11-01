const elementos = {
  listaProdutos: '.features_items',
  cardProduto: '.features_items .product-image-wrapper',
  nomeNoCard: '.productinfo p',
  linkVerProduto: '.choose a[href^="/product_details/"]',
  campoBusca: '#search_product',
  botaoBusca: '#submit_search',
  botaoAdicionar: (id) => `.productinfo a.add-to-cart[data-product-id="${id}"]`,
  modalCarrinho: '#cartModal',
  botaoContinuarComprando: '#cartModal .close-modal',
  detalhe: '.product-information',
}

export function cardsDeProduto() {
  return cy.get(elementos.cardProduto)
}

export function nomesDosProdutos() {
  return cy.get(`${elementos.cardProduto} ${elementos.nomeNoCard}`)
}

export function abrirDetalheDoPrimeiroProduto() {
  cy.get(elementos.cardProduto).first().find(elementos.linkVerProduto).click()
}

export function buscarProduto(termo) {
  cy.get(elementos.campoBusca).type(termo)
  cy.get(elementos.botaoBusca).click()
}

export function adicionarAoCarrinho(idProduto) {
  cy.get(elementos.botaoAdicionar(idProduto)).first().click()
  cy.get(elementos.modalCarrinho).should('be.visible')
  cy.get(elementos.botaoContinuarComprando).click()
  cy.get(elementos.modalCarrinho).should('not.be.visible')
}

export function detalheDoProduto() {
  return cy.get(elementos.detalhe)
}
