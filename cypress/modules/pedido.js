const elementos = {
  linhaProduto: (id) => `#product-${id}`,
  botaoCheckout: '#do_action .check_out',
  enderecoEntrega: '#address_delivery',
  revisaoPedido: '#cart_info',
  comentario: 'textarea[name="message"]',
  botaoFazerPedido: 'a[href="/payment"]',
  nomeNoCartao: '[data-qa="name-on-card"]',
  numeroCartao: '[data-qa="card-number"]',
  cvc: '[data-qa="cvc"]',
  mesValidade: '[data-qa="expiry-month"]',
  anoValidade: '[data-qa="expiry-year"]',
  botaoPagar: '[data-qa="pay-button"]',
  formularioPagamento: '#payment-form',
  mensagemSucessoPagamento: '#success_message',
  pedidoConfirmado: '[data-qa="order-placed"]',
}

export function produtoNoCarrinho(idProduto) {
  return cy.get(elementos.linhaProduto(idProduto))
}

export function irParaCheckout() {
  cy.get(elementos.botaoCheckout).click()
}

export function enderecoDeEntrega() {
  return cy.get(elementos.enderecoEntrega)
}

export function revisaoDoPedido() {
  return cy.get(elementos.revisaoPedido)
}

export function comentarEFazerPedido(comentario) {
  cy.get(elementos.comentario).type(comentario)
  cy.get(elementos.botaoFazerPedido).click()
}

export function pagar(nomeNoCartao, cartao) {
  cy.get(elementos.nomeNoCartao).type(nomeNoCartao)
  cy.get(elementos.numeroCartao).type(cartao.numero, { log: false })
  cy.get(elementos.cvc).type(cartao.cvc, { log: false })
  cy.get(elementos.mesValidade).type(cartao.mesValidade)
  cy.get(elementos.anoValidade).type(cartao.anoValidade)
}

/**
 * A aplicação exibe a mensagem de sucesso no evento submit do formulário e logo em seguida
 * navega para /payment_done, então ela some antes de qualquer comando seguinte do Cypress.
 * Um listener registrado depois do da aplicação lê o estado real da mensagem nesse instante.
 * Retorna um objeto preenchido no submit: { visivel, texto }.
 */
export function confirmarPagamento() {
  const mensagem = { visivel: false, texto: '' }
  cy.get(elementos.formularioPagamento).then(($formulario) => {
    $formulario.on('submit', () => {
      const $mensagem = Cypress.$(elementos.mensagemSucessoPagamento)
      mensagem.visivel = !$mensagem.hasClass('hide') && $mensagem.is(':visible')
      mensagem.texto = $mensagem.text().trim()
    })
  })
  cy.get(elementos.botaoPagar).click()
  return cy.wrap(mensagem)
}

export function pedidoConfirmado() {
  return cy.get(elementos.pedidoConfirmado)
}
