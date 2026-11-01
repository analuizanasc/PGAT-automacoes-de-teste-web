import { criarUsuario } from '../utils/usuarioFactory'
import * as navegacao from '../modules/navegacao'
import * as autenticacao from '../modules/autenticacao'
import * as cadastro from '../modules/cadastro'

describe('Login e logout', () => {
  let usuario

  beforeEach(() => {
    usuario = criarUsuario()
    navegacao.abrirHome()
    navegacao.abrirLoginCadastro()
    cy.contains('h2', 'Login to your account').should('be.visible')
  })

  it('TC2 - deve entrar com e-mail e senha corretos', () => {
    cy.criarUsuarioViaApi(usuario)

    autenticacao.entrar(usuario.email, usuario.senha)

    navegacao.usuarioLogado().should('be.visible').and('contain.text', `Logged in as ${usuario.nome}`)

    navegacao.excluirConta()
    cy.get('[data-qa="account-deleted"]').should('be.visible').and('contain.text', 'Account Deleted!')
    cadastro.continuar()
  })

  it('TC3 - não deve entrar com e-mail e senha incorretos', () => {
    // usuário gerado e nunca cadastrado: as credenciais não existem na aplicação
    autenticacao.entrar(usuario.email, usuario.senha)

    autenticacao.mensagemErroLogin()
      .should('be.visible')
      .and('have.text', 'Your email or password is incorrect!')
    navegacao.usuarioLogado().should('not.exist')
  })

  it('TC4 - deve sair da conta e voltar para a página de login', () => {
    cy.criarUsuarioViaApi(usuario)
    autenticacao.entrar(usuario.email, usuario.senha)
    navegacao.usuarioLogado().should('be.visible').and('contain.text', `Logged in as ${usuario.nome}`)

    navegacao.sair()

    cy.location('pathname').should('eq', '/login')
    cy.contains('h2', 'Login to your account').should('be.visible')
    navegacao.usuarioLogado().should('not.exist')
    navegacao.linkLoginCadastro().should('be.visible')

    cy.excluirUsuarioViaApi(usuario)
  })
})
