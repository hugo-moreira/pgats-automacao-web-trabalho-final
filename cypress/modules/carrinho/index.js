/// <reference types="cypress" />

// Modulo de acoes de negocio relacionadas ao CARRINHO de compras.

const seletores = {
  linkCarrinho: '.nav a[href="/view_cart"]',
  tabelaCarrinho: '#cart_info_table',
  itensCarrinho: '#cart_info_table tbody tr',
  nomeItem: '.cart_description h4 a',
  botaoProsseguirCheckout: '.check_out',
}

/**
 * Acessa a pagina do carrinho pelo menu superior e verifica que ela foi exibida
 * (URL contem /view_cart e tabela de itens visivel).
 *
 * @returns {void} Nao retorna valor; encadeia comandos Cypress.
 */
function acessarCarrinho() {
  cy.get(seletores.linkCarrinho).click()
  verificarSePaginaDoCarrinhoFoiExibida()
}

/**
 * Verifica que a pagina do carrinho esta exibida com a tabela de itens visivel.
 *
 * @returns {void} Nao retorna valor; encadeia comandos Cypress.
 */
function verificarSePaginaDoCarrinhoFoiExibida() {
  cy.url().should('include', '/view_cart')
  cy.get(seletores.tabelaCarrinho).should('be.visible')
}

/**
 * Verifica que o carrinho possui exatamente a quantidade de itens informada.
 *
 * @param {number} quantidade - Numero de linhas (produtos distintos) esperado no carrinho.
 * @returns {void} Nao retorna valor; encadeia comandos Cypress.
 */
function verificarQuantidadeDeItensNoCarrinho(quantidade) {
  cy.get(seletores.itensCarrinho).should('have.length', quantidade)
}

/**
 * Clica em "Proceed To Checkout" na pagina do carrinho e verifica que a pagina de
 * checkout foi aberta.
 *
 * Pre-condicao: usuario autenticado e carrinho com itens.
 *
 * @returns {void} Nao retorna valor; encadeia comandos Cypress.
 */
function prosseguirParaCheckout() {
  cy.contains(seletores.botaoProsseguirCheckout, 'Proceed To Checkout').click()
  cy.url().should('include', '/checkout')
}

module.exports = {
  seletores,
  acessarCarrinho,
  verificarSePaginaDoCarrinhoFoiExibida,
  verificarQuantidadeDeItensNoCarrinho,
  prosseguirParaCheckout,
}
