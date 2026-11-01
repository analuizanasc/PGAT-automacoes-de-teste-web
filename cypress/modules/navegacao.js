const elementos = {
  linkProdutos: 'header a[href="/products"]',
  linkCarrinho: 'header a[href="/view_cart"]',
  linkLoginCadastro: 'header a[href="/login"]',
  linkLogout: 'header a[href="/logout"]',
  linkExcluirConta: 'header a[href="/delete_account"]',
  usuarioLogado: 'header li:contains("Logged in as")',
}

/** Passos 1 a 3 comuns a todos os casos: abrir a aplicação e verificar que a home está visível. */
export function abrirHome() {
  cy.visit('/')
  cy.title().should('eq', 'Automation Exercise')
  cy.get('#slider').should('be.visible')
}

export function abrirLoginCadastro() {
  cy.get(elementos.linkLoginCadastro).click()
}

export function abrirProdutos() {
  cy.get(elementos.linkProdutos).click()
}

export function abrirCarrinho() {
  cy.get(elementos.linkCarrinho).click()
}

export function sair() {
  cy.get(elementos.linkLogout).click()
}

export function excluirConta() {
  cy.get(elementos.linkExcluirConta).click()
}

export function usuarioLogado() {
  return cy.get(elementos.usuarioLogado)
}

export function linkLoginCadastro() {
  return cy.get(elementos.linkLoginCadastro)
}
