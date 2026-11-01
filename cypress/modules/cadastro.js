const elementos = {
  nome: '[data-qa="signup-name"]',
  email: '[data-qa="signup-email"]',
  botaoSignup: '[data-qa="signup-button"]',
  mensagemErroSignup: '.signup-form form p',
  titulo: (titulo) => (titulo === 'Mr' ? '#id_gender1' : '#id_gender2'),
  nomeConta: '[data-qa="name"]',
  emailConta: '[data-qa="email"]',
  senha: '[data-qa="password"]',
  dia: '[data-qa="days"]',
  mes: '[data-qa="months"]',
  ano: '[data-qa="years"]',
  newsletter: '#newsletter',
  ofertasParceiros: '#optin',
  primeiroNome: '[data-qa="first_name"]',
  sobrenome: '[data-qa="last_name"]',
  empresa: '[data-qa="company"]',
  endereco: '[data-qa="address"]',
  complemento: '[data-qa="address2"]',
  pais: '[data-qa="country"]',
  estado: '[data-qa="state"]',
  cidade: '[data-qa="city"]',
  cep: '[data-qa="zipcode"]',
  celular: '[data-qa="mobile_number"]',
  botaoCriarConta: '[data-qa="create-account"]',
  botaoContinuar: '[data-qa="continue-button"]',
}

export function iniciarCadastro(nome, email) {
  cy.get(elementos.nome).type(nome)
  cy.get(elementos.email).type(email)
  cy.get(elementos.botaoSignup).click()
}

export function preencherInformacoesDaConta(usuario) {
  cy.get(elementos.titulo(usuario.titulo)).check()
  cy.get(elementos.senha).type(usuario.senha, { log: false })
  cy.get(elementos.dia).select(usuario.diaNascimento)
  cy.get(elementos.mes).select(usuario.mesNascimento)
  cy.get(elementos.ano).select(usuario.anoNascimento)
}

export function aceitarNewsletterEOfertas() {
  cy.get(elementos.newsletter).check()
  cy.get(elementos.ofertasParceiros).check()
}

export function preencherEndereco(usuario) {
  cy.get(elementos.primeiroNome).type(usuario.primeiroNome)
  cy.get(elementos.sobrenome).type(usuario.sobrenome)
  cy.get(elementos.empresa).type(usuario.empresa)
  cy.get(elementos.endereco).type(usuario.endereco)
  cy.get(elementos.complemento).type(usuario.complemento)
  cy.get(elementos.pais).select(usuario.pais)
  cy.get(elementos.estado).type(usuario.estado)
  cy.get(elementos.cidade).type(usuario.cidade)
  cy.get(elementos.cep).type(usuario.cep)
  cy.get(elementos.celular).type(usuario.celular)
}

export function criarConta() {
  cy.get(elementos.botaoCriarConta).click()
}

export function continuar() {
  cy.get(elementos.botaoContinuar).click()
}

/** Fluxo completo de cadastro pela tela, para casos em que o cadastro faz parte do objetivo. */
export function cadastrarPelaTela(usuario) {
  iniciarCadastro(usuario.nome, usuario.email)
  preencherInformacoesDaConta(usuario)
  aceitarNewsletterEOfertas()
  preencherEndereco(usuario)
  criarConta()
}

export function mensagemErroSignup() {
  return cy.get(elementos.mensagemErroSignup)
}

export function nomeDaConta() {
  return cy.get(elementos.nomeConta)
}

export function emailDaConta() {
  return cy.get(elementos.emailConta)
}
