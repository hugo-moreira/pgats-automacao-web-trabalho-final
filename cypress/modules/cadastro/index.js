/// <reference types="cypress" />

// Modulo de acoes de negocio relacionadas ao CADASTRO de usuario.
// Padrao adotado em aula: funcoes nomeadas em portugues, seletores agrupados na
// constante `seletores`, assercoes dentro do modulo e exportacao via module.exports.

const seletores = {
  linkSignupLogin: 'a[href*="login"]',
  tituloNovoUsuario: 'h2',
  nome: '[data-qa="signup-name"]',
  email: '[data-qa="signup-email"]',
  botaoSignup: '[data-qa="signup-button"]',
  tituloInformacoesConta: 'h2 b',
  generoMr: '#id_gender1',
  generoMrs: '#id_gender2',
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
  endereco2: '[data-qa="address2"]',
  pais: '[data-qa="country"]',
  estado: '[data-qa="state"]',
  cidade: '[data-qa="city"]',
  cep: '[data-qa="zipcode"]',
  celular: '[data-qa="mobile_number"]',
  botaoCriarConta: '[data-qa="create-account"]',
  contaCriada: '[data-qa="account-created"]',
  botaoContinuar: '[data-qa="continue-button"]',
  mensagemEmailExistente: 'form[action*="signup"] p',
  linkExcluirConta: 'a[href*="delete_account"]',
  contaExcluida: '[data-qa="account-deleted"]',
}

/**
 * Acessa a pagina "Signup / Login" a partir do menu superior e verifica que os
 * blocos "New User Signup!" e "Login to your account" estao visiveis.
 *
 * Pre-condicao: estar em qualquer pagina da aplicacao que exiba o menu superior.
 *
 * @returns {void} Nao retorna valor; encadeia comandos Cypress.
 */
function acessarPaginaDeLogin() {
  cy.get(seletores.linkSignupLogin).click()
  cy.contains(seletores.tituloNovoUsuario, 'New User Signup!').should('be.visible')
  cy.contains(seletores.tituloNovoUsuario, 'Login to your account').should('be.visible')
}

/**
 * Inicia o cadastro preenchendo nome e e-mail no bloco "New User Signup!" e clicando em "Signup".
 *
 * Pre-condicao: estar na pagina /login.
 *
 * @param {string} nome - Nome completo do novo usuario (sera exibido em "Logged in as <nome>").
 * @param {string} email - E-mail unico ainda nao cadastrado na aplicacao.
 * @returns {void} Nao retorna valor; encadeia comandos Cypress.
 */
function iniciarCadastro(nome, email) {
  cy.get(seletores.nome).type(nome)
  cy.get(seletores.email).type(email)
  cy.get(seletores.botaoSignup).click()
}

/**
 * Preenche o formulario "Enter Account Information" completo (dados da conta e endereco)
 * e clica em "Create Account".
 *
 * Pre-condicao: iniciarCadastro() ja executado com e-mail inedito (pagina /signup aberta).
 *
 * @param {object} usuario - Dados do usuario (formato retornado por commons.gerarUsuario()).
 * @param {'Mr'|'Mrs'} usuario.titulo - Titulo; define qual radio de genero sera marcado.
 * @param {string} usuario.senha - Senha da conta.
 * @param {string} usuario.dia - Dia de nascimento (1 a 31) como texto.
 * @param {string} usuario.mes - Mes de nascimento em ingles (ex.: "September").
 * @param {string} usuario.ano - Ano de nascimento como texto (ex.: "1990").
 * @param {string} usuario.primeiroNome - Primeiro nome.
 * @param {string} usuario.sobrenome - Sobrenome.
 * @param {string} usuario.empresa - Empresa.
 * @param {string} usuario.endereco - Endereco principal.
 * @param {string} usuario.endereco2 - Complemento do endereco.
 * @param {string} usuario.pais - Pais (deve existir no select: India, United States, Canada, Australia, Israel, New Zealand, Singapore).
 * @param {string} usuario.estado - Estado.
 * @param {string} usuario.cidade - Cidade.
 * @param {string} usuario.cep - CEP/Zipcode.
 * @param {string} usuario.celular - Numero de celular.
 * @returns {void} Nao retorna valor; encadeia comandos Cypress.
 */
function preencherCadastro(usuario) {
  cy.contains(seletores.tituloInformacoesConta, 'Enter Account Information').should('be.visible')

  cy.get(usuario.titulo === 'Mrs' ? seletores.generoMrs : seletores.generoMr).check()
  cy.get(seletores.senha).type(usuario.senha, { log: false })
  cy.get(seletores.dia).select(usuario.dia)
  cy.get(seletores.mes).select(usuario.mes)
  cy.get(seletores.ano).select(usuario.ano)
  cy.get(seletores.newsletter).check()
  cy.get(seletores.ofertasParceiros).check()

  cy.get(seletores.primeiroNome).type(usuario.primeiroNome)
  cy.get(seletores.sobrenome).type(usuario.sobrenome)
  cy.get(seletores.empresa).type(usuario.empresa)
  cy.get(seletores.endereco).type(usuario.endereco)
  cy.get(seletores.endereco2).type(usuario.endereco2)
  cy.get(seletores.pais).select(usuario.pais)
  cy.get(seletores.estado).type(usuario.estado)
  cy.get(seletores.cidade).type(usuario.cidade)
  cy.get(seletores.cep).type(usuario.cep)
  cy.get(seletores.celular).type(usuario.celular)

  cy.get(seletores.botaoCriarConta).click()
}

/**
 * Verifica que a pagina "Account Created!" foi exibida e clica em "Continue",
 * retornando para a home ja autenticado.
 *
 * @returns {void} Nao retorna valor; encadeia comandos Cypress.
 */
function verificarSeCadastroFoiEfetuadoComSucesso() {
  cy.get(seletores.contaCriada).should('be.visible').and('contain', 'Account Created!')
  cy.get(seletores.botaoContinuar).click()
}

/**
 * Verifica que a mensagem "Email Address already exist!" foi exibida ao tentar
 * iniciar um cadastro com e-mail ja utilizado.
 *
 * @returns {void} Nao retorna valor; encadeia comandos Cypress.
 */
function verificarSeMensagemDeCadastroExistenteFoiExibida() {
  cy.get(seletores.mensagemEmailExistente)
    .should('be.visible')
    .and('contain', 'Email Address already exist!')
}

/**
 * Exclui a conta do usuario autenticado pelo link "Delete Account" do menu, verifica a
 * mensagem "Account Deleted!" e clica em "Continue". Utilizada como limpeza (teardown)
 * para nao acumular contas no ambiente compartilhado.
 *
 * Pre-condicao: usuario autenticado.
 *
 * @returns {void} Nao retorna valor; encadeia comandos Cypress.
 */
function excluirConta() {
  cy.get(seletores.linkExcluirConta).click()
  cy.get(seletores.contaExcluida).should('be.visible').and('contain', 'Account Deleted!')
  cy.get(seletores.botaoContinuar).click()
}

module.exports = {
  seletores,
  acessarPaginaDeLogin,
  iniciarCadastro,
  preencherCadastro,
  verificarSeCadastroFoiEfetuadoComSucesso,
  verificarSeMensagemDeCadastroExistenteFoiExibida,
  excluirConta,
}
