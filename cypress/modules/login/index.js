/// <reference types="cypress" />

// Modulo de acoes de negocio relacionadas a LOGIN / LOGOUT.

const seletores = {
  email: '[data-qa="login-email"]',
  senha: '[data-qa="login-password"]',
  botaoLogin: '[data-qa="login-button"]',
  usuarioLogado: 'a b',
  mensagemErroLogin: 'form[action*="login"] p',
  linkLogout: 'a[href*="logout"]',
  tituloFormularioLogin: '.login-form h2',
}

/**
 * Preenche e-mail e senha no bloco "Login to your account" e clica em "Login".
 *
 * Pre-condicao: estar na pagina /login (use cadastro.acessarPaginaDeLogin()).
 *
 * @param {string} email - E-mail do usuario (valido ou invalido, conforme o cenario).
 * @param {string} senha - Senha do usuario (valida ou invalida, conforme o cenario).
 * @returns {void} Nao retorna valor; encadeia comandos Cypress.
 */
function preencherLogin(email, senha) {
  cy.get(seletores.email).type(email)
  cy.get(seletores.senha).type(senha, { log: false })
  cy.get(seletores.botaoLogin).click()
}

/**
 * Verifica que o login foi efetuado com sucesso, validando que o menu superior exibe
 * "Logged in as <nome>".
 *
 * @param {string} nome - Nome do usuario esperado no menu superior.
 * @returns {void} Nao retorna valor; encadeia comandos Cypress.
 */
function verificarSeLoginFoiEfetuadoComSucesso(nome) {
  cy.get(seletores.usuarioLogado).should('contain', nome)
  cy.contains(`Logged in as ${nome}`).should('be.visible')
}

/**
 * Verifica que a mensagem "Your email or password is incorrect!" foi exibida apos
 * uma tentativa de login com credenciais invalidas.
 *
 * @returns {void} Nao retorna valor; encadeia comandos Cypress.
 */
function verificarSeMensagemDeErroFoiExibidaNoLogin() {
  cy.get(seletores.mensagemErroLogin)
    .should('exist')
    .and('be.visible')
    .and('contain', 'Your email or password is incorrect!')
}

/**
 * Efetua o logout clicando no link "Logout" do menu superior.
 *
 * Pre-condicao: usuario autenticado.
 *
 * @returns {void} Nao retorna valor; encadeia comandos Cypress.
 */
function efetuarLogout() {
  cy.get(seletores.linkLogout).should('be.visible').click()
}

/**
 * Verifica que o usuario foi deslogado: formulario de login visivel, URL contendo
 * "login" e link "Logout" ausente do menu.
 *
 * @returns {void} Nao retorna valor; encadeia comandos Cypress.
 */
function verificarSeUsuarioFoiDeslogado() {
  cy.get(seletores.tituloFormularioLogin).should('be.visible')
  cy.url().should('include', 'login')
  cy.get(seletores.linkLogout).should('not.exist')
}

module.exports = {
  seletores,
  preencherLogin,
  verificarSeLoginFoiEfetuadoComSucesso,
  verificarSeMensagemDeErroFoiExibidaNoLogin,
  efetuarLogout,
  verificarSeUsuarioFoiDeslogado,
}
