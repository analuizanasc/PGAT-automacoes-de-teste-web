import { criarUsuario } from '../utils/usuarioFactory'
import * as navegacao from '../modules/navegacao'
import * as cadastro from '../modules/cadastro'
import * as autenticacao from '../modules/autenticacao'
import * as catalogo from '../modules/catalogo'
import * as pedido from '../modules/pedido'

describe('Fechamento de pedido', () => {
  let usuario
  let massa

  before(() => {
    cy.fixture('produtos').then((dados) => {
      massa = dados
    })
  })

  beforeEach(() => {
    usuario = criarUsuario()
    navegacao.abrirHome()
  })

  // Passos que TC15 e TC16 compartilham depois que o usuário está logado
  function fecharPedidoEExcluirConta() {
    const { produtoCarrinho, cartao } = massa

    catalogo.adicionarAoCarrinho(produtoCarrinho.id)
    navegacao.abrirCarrinho()

    cy.location('pathname').should('eq', '/view_cart')
    cy.contains('.breadcrumb .active', 'Shopping Cart').should('be.visible')
    pedido.produtoNoCarrinho(produtoCarrinho.id).should('contain.text', produtoCarrinho.nome)

    pedido.irParaCheckout()

    cy.contains('h2', 'Address Details').should('be.visible')
    pedido.enderecoDeEntrega()
      .should('contain.text', `${usuario.primeiroNome} ${usuario.sobrenome}`)
      .and('contain.text', usuario.endereco)
      .and('contain.text', usuario.cidade)
      .and('contain.text', usuario.pais)
      .and('contain.text', usuario.celular)
    cy.contains('h2', 'Review Your Order').should('be.visible')
    pedido.revisaoDoPedido()
      .should('contain.text', produtoCarrinho.nome)
      .and('contain.text', produtoCarrinho.preco)

    pedido.comentarEFazerPedido('Entregar em horário comercial.')
    pedido.pagar(`${usuario.primeiroNome} ${usuario.sobrenome}`, cartao)
    pedido.confirmarPagamento().then((mensagem) => {
      expect(mensagem.visivel, 'mensagem de sucesso visível no envio').to.be.true
      expect(mensagem.texto).to.eq('Your order has been placed successfully!')
    })

    cy.location('pathname').should('match', /^\/payment_done\//)
    pedido.pedidoConfirmado().should('be.visible').and('contain.text', 'Order Placed!')

    navegacao.excluirConta()
    cy.get('[data-qa="account-deleted"]').should('be.visible').and('contain.text', 'Account Deleted!')
    cadastro.continuar()
  }

  it('TC15 - deve cadastrar o usuário antes do checkout e concluir o pedido', () => {
    navegacao.abrirLoginCadastro()
    cadastro.cadastrarPelaTela(usuario)

    cy.get('[data-qa="account-created"]').should('be.visible').and('contain.text', 'Account Created!')
    cadastro.continuar()
    navegacao.usuarioLogado().should('be.visible').and('contain.text', `Logged in as ${usuario.nome}`)

    fecharPedidoEExcluirConta()
  })

  it('TC16 - deve entrar antes do checkout e concluir o pedido', () => {
    cy.criarUsuarioViaApi(usuario)
    navegacao.abrirLoginCadastro()
    autenticacao.entrar(usuario.email, usuario.senha)
    navegacao.usuarioLogado().should('be.visible').and('contain.text', `Logged in as ${usuario.nome}`)

    fecharPedidoEExcluirConta()
  })
})
