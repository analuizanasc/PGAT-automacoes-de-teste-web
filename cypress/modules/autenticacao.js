const elementos = {
  email: '[data-qa="login-email"]',
  senha: '[data-qa="login-password"]',
  botaoLogin: '[data-qa="login-button"]',
  mensagemErroLogin: '.login-form form p',
}

export function entrar(email, senha) {
  cy.get(elementos.email).type(email)
  cy.get(elementos.senha).type(senha, { log: false })
  cy.get(elementos.botaoLogin).click()
}

export function mensagemErroLogin() {
  return cy.get(elementos.mensagemErroLogin)
}
