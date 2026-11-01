// Setup e limpeza de massa via API pública do Automation Exercise (https://automationexercise.com/api_list).
// A API devolve o JSON como texto e sempre com HTTP 200; o resultado real vem em responseCode.

const lerCorpo = (resposta) => (typeof resposta.body === 'string' ? JSON.parse(resposta.body) : resposta.body)

Cypress.Commands.add('criarUsuarioViaApi', (usuario) => {
  cy.request({
    method: 'POST',
    url: '/api/createAccount',
    form: true,
    body: {
      name: usuario.nome,
      email: usuario.email,
      password: usuario.senha,
      title: usuario.titulo,
      birth_date: usuario.diaNascimento,
      birth_month: usuario.mesNascimento,
      birth_year: usuario.anoNascimento,
      firstname: usuario.primeiroNome,
      lastname: usuario.sobrenome,
      company: usuario.empresa,
      address1: usuario.endereco,
      address2: usuario.complemento,
      country: usuario.pais,
      zipcode: usuario.cep,
      state: usuario.estado,
      city: usuario.cidade,
      mobile_number: usuario.celular,
    },
  }).then((resposta) => {
    expect(lerCorpo(resposta).responseCode, 'usuário criado via API').to.eq(201)
  })
})

Cypress.Commands.add('excluirUsuarioViaApi', (usuario) => {
  cy.request({
    method: 'DELETE',
    url: '/api/deleteAccount',
    form: true,
    body: { email: usuario.email, password: usuario.senha },
  }).then((resposta) => {
    expect(lerCorpo(resposta).responseCode, 'usuário excluído via API').to.eq(200)
  })
})

Cypress.Commands.add('buscarProdutosViaApi', (termo) => {
  return cy.request({
    method: 'POST',
    url: '/api/searchProduct',
    form: true,
    body: { search_product: termo },
  }).then((resposta) => {
    const corpo = lerCorpo(resposta)
    expect(corpo.responseCode, 'busca de produtos via API').to.eq(200)
    return corpo.products
  })
})
