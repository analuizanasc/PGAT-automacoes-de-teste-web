import * as navegacao from '../modules/navegacao'
import { criarUsuario } from '../utils/usuarioFactory'

describe('Assinatura da newsletter', () => {
  it('TC10 - deve assinar a newsletter pelo rodapé da home', () => {
    const { email } = criarUsuario()
    navegacao.abrirHome()

    cy.get('footer').scrollIntoView()
    cy.contains('footer h2', 'Subscription').should('be.visible')

    cy.get('#susbscribe_email').type(email)
    cy.get('#subscribe').click()

    cy.get('#success-subscribe')
      .should('be.visible')
      .and('contain.text', 'You have been successfully subscribed!')
  })
})
