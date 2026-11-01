import { criarUsuario } from '../utils/usuarioFactory'
import * as navegacao from '../modules/navegacao'
import * as cadastro from '../modules/cadastro'

describe('Cadastro de usuário', () => {
  beforeEach(() => {
    navegacao.abrirHome()
    navegacao.abrirLoginCadastro()
    cy.contains('h2', 'New User Signup!').should('be.visible')
  })

  it('TC1 - deve cadastrar um novo usuário e excluir a conta em seguida', () => {
    const usuario = criarUsuario()

    cadastro.iniciarCadastro(usuario.nome, usuario.email)
    cy.contains('b', 'Enter Account Information', { matchCase: false }).should('be.visible')
    cadastro.nomeDaConta().should('have.value', usuario.nome)
    cadastro.emailDaConta().should('have.value', usuario.email)

    cadastro.preencherInformacoesDaConta(usuario)
    cadastro.aceitarNewsletterEOfertas()
    cadastro.preencherEndereco(usuario)
    cadastro.criarConta()

    cy.get('[data-qa="account-created"]').should('be.visible').and('contain.text', 'Account Created!')
    cadastro.continuar()
    navegacao.usuarioLogado().should('be.visible').and('contain.text', `Logged in as ${usuario.nome}`)

    navegacao.excluirConta()
    cy.get('[data-qa="account-deleted"]').should('be.visible').and('contain.text', 'Account Deleted!')
    cadastro.continuar()
    navegacao.linkLoginCadastro().should('be.visible')
  })

  context('com e-mail já cadastrado', () => {
    const usuarioExistente = criarUsuario()

    before(() => {
      cy.criarUsuarioViaApi(usuarioExistente)
    })

    after(() => {
      cy.excluirUsuarioViaApi(usuarioExistente)
    })

    it('TC5 - não deve permitir cadastro com e-mail já registrado', () => {
      cadastro.iniciarCadastro('Outro Nome', usuarioExistente.email)

      cadastro.mensagemErroSignup().should('be.visible').and('have.text', 'Email Address already exist!')
      cy.location('pathname').should('eq', '/signup')
      cy.contains('Enter Account Information', { matchCase: false }).should('not.exist')
    })
  })
})
