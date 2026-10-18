/// <reference types="cypress" />

// Modulo de acoes de negocio relacionadas a ASSINATURA da newsletter (rodape da pagina).

const seletores = {
  rodape: 'footer',
  tituloAssinatura: 'footer h2',
  campoEmailAssinatura: '#susbscribe_email',
  botaoAssinar: '#subscribe',
  mensagemAssinaturaSucesso: '#success-subscribe .alert-success',
}

/**
 * Rola a pagina ate o rodape e verifica que o titulo "Subscription" esta visivel.
 *
 * @returns {void} Nao retorna valor; encadeia comandos Cypress.
 */
function rolarAteAssinaturaNoRodape() {
  cy.get(seletores.rodape).scrollIntoView()
  cy.contains(seletores.tituloAssinatura, 'Subscription').should('be.visible')
}

/**
 * Preenche o e-mail no campo de assinatura do rodape e clica no botao de seta.
 *
 * @param {string} email - E-mail a ser cadastrado na newsletter.
 * @returns {void} Nao retorna valor; encadeia comandos Cypress.
 */
function assinarNewsletter(email) {
  cy.get(seletores.campoEmailAssinatura).type(email)
  cy.get(seletores.botaoAssinar).click()
}

/**
 * Verifica que a mensagem "You have been successfully subscribed!" foi exibida.
 *
 * @returns {void} Nao retorna valor; encadeia comandos Cypress.
 */
function verificarSeAssinaturaFoiEfetuadaComSucesso() {
  cy.get(seletores.mensagemAssinaturaSucesso)
    .should('be.visible')
    .and('contain', 'You have been successfully subscribed!')
}

module.exports = {
  seletores,
  rolarAteAssinaturaNoRodape,
  assinarNewsletter,
  verificarSeAssinaturaFoiEfetuadaComSucesso,
}
