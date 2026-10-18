/// <reference types="cypress" />

// Modulo de acoes de negocio relacionadas ao CHECKOUT e PAGAMENTO.

const seletores = {
  titulosEtapas: 'h2.heading',
  enderecoEntrega: '#address_delivery',
  enderecoCobranca: '#address_invoice',
  // Na pagina de checkout a tabela nao possui id proprio (diferente de /view_cart, que usa #cart_info_table).
  tabelaRevisao: '#cart_info table',
  totalPedido: '#cart_info .cart_total_price',
  comentario: 'textarea[name="message"]',
  botaoFinalizarPedido: 'a.check_out',
  nomeNoCartao: '[data-qa="name-on-card"]',
  numeroCartao: '[data-qa="card-number"]',
  cvc: '[data-qa="cvc"]',
  mesValidade: '[data-qa="expiry-month"]',
  anoValidade: '[data-qa="expiry-year"]',
  botaoPagar: '[data-qa="pay-button"]',
  pedidoRealizado: '[data-qa="order-placed"]',
  mensagemConfirmacao: 'p',
  botaoContinuar: '[data-qa="continue-button"]',
}

/**
 * Verifica, na pagina de checkout, as secoes "Address Details" e "Review Your Order" e
 * confere que os enderecos de entrega e cobranca exibem os dados do usuario informado.
 *
 * Pre-condicao: estar na pagina /checkout.
 *
 * @param {object} usuario - Dados do usuario (formato de commons.gerarUsuario()).
 * @param {string} usuario.primeiroNome - Primeiro nome esperado no endereco.
 * @param {string} usuario.sobrenome - Sobrenome esperado no endereco.
 * @param {string} usuario.endereco - Endereco principal esperado.
 * @param {string} usuario.cidade - Cidade esperada.
 * @param {string} usuario.pais - Pais esperado.
 * @param {string} usuario.celular - Telefone esperado.
 * @returns {void} Nao retorna valor; encadeia comandos Cypress.
 */
function verificarEnderecoEResumoDoPedido(usuario) {
  cy.contains(seletores.titulosEtapas, 'Address Details').should('be.visible')
  cy.contains(seletores.titulosEtapas, 'Review Your Order').should('be.visible')

  ;[seletores.enderecoEntrega, seletores.enderecoCobranca].forEach((bloco) => {
    cy.get(bloco)
      .should('contain', usuario.primeiroNome)
      .and('contain', usuario.sobrenome)
      .and('contain', usuario.endereco)
      .and('contain', usuario.cidade)
      .and('contain', usuario.pais)
      .and('contain', usuario.celular)
  })

  cy.get(seletores.tabelaRevisao).should('be.visible')
  cy.get(seletores.totalPedido).last().should('be.visible').and('contain', 'Rs.')
}

/**
 * Preenche o comentario do pedido e clica em "Place Order", abrindo a pagina de pagamento.
 *
 * Pre-condicao: estar na pagina /checkout.
 *
 * @param {string} comentario - Texto livre a ser enviado como observacao do pedido.
 * @returns {void} Nao retorna valor; encadeia comandos Cypress.
 */
function adicionarComentarioEFinalizarPedido(comentario) {
  cy.get(seletores.comentario).type(comentario)
  cy.contains(seletores.botaoFinalizarPedido, 'Place Order').click()
  cy.url().should('include', '/payment')
}

/**
 * Preenche os dados do cartao na pagina de pagamento e clica em "Pay and Confirm Order".
 *
 * Pre-condicao: estar na pagina /payment.
 *
 * @param {object} cartao - Dados do cartao (formato de commons.gerarCartao()).
 * @param {string} cartao.nome - Nome impresso no cartao.
 * @param {string} cartao.numero - Numero do cartao.
 * @param {string} cartao.cvc - Codigo de seguranca.
 * @param {string} cartao.mesValidade - Mes de validade (MM).
 * @param {string} cartao.anoValidade - Ano de validade (YYYY).
 * @returns {void} Nao retorna valor; encadeia comandos Cypress.
 */
function preencherPagamento(cartao) {
  cy.get(seletores.nomeNoCartao).type(cartao.nome)
  cy.get(seletores.numeroCartao).type(cartao.numero)
  cy.get(seletores.cvc).type(cartao.cvc)
  cy.get(seletores.mesValidade).type(cartao.mesValidade)
  cy.get(seletores.anoValidade).type(cartao.anoValidade)
  cy.get(seletores.botaoPagar).click()
}

/**
 * Verifica que o pedido foi concluido com sucesso. A aplicacao exibe por um instante a
 * mensagem "Your order has been placed successfully!" e redireciona para /payment_done,
 * onde mostra "Order Placed!" e "Congratulations! Your order has been confirmed!".
 * Como a mensagem intermediaria some rapidamente, a assercao e feita no estado final estavel.
 *
 * @returns {void} Nao retorna valor; encadeia comandos Cypress.
 */
function verificarSePedidoFoiRealizadoComSucesso() {
  cy.url().should('include', '/payment_done')
  cy.get(seletores.pedidoRealizado).should('be.visible').and('contain', 'Order Placed!')
  cy.contains(seletores.mensagemConfirmacao, 'Congratulations! Your order has been confirmed!').should('be.visible')
}

module.exports = {
  seletores,
  verificarEnderecoEResumoDoPedido,
  adicionarComentarioEFinalizarPedido,
  preencherPagamento,
  verificarSePedidoFoiRealizadoComSucesso,
}
