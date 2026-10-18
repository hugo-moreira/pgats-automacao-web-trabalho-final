/// <reference types="cypress" />

// Modulo de utilitarios transversais: geracao de dados dinamicos (faker),
// navegacao inicial e preparacao de massa via API.

const { faker } = require('@faker-js/faker')

const seletores = {
  bannerPrincipal: '#slider',
}

/**
 * Gera um usuario completo com dados dinamicos usando @faker-js/faker.
 *
 * O e-mail recebe um sufixo com Date.now() para garantir unicidade mesmo que o faker
 * sorteie o mesmo nome em execucoes diferentes (evita o erro "Email Address already exist!").
 *
 * @returns {{
 *   nome: string, email: string, senha: string, titulo: 'Mr'|'Mrs',
 *   dia: string, mes: string, ano: string,
 *   primeiroNome: string, sobrenome: string, empresa: string,
 *   endereco: string, endereco2: string, pais: string, estado: string,
 *   cidade: string, cep: string, celular: string
 * }} Objeto com todos os campos exigidos pelo formulario de cadastro do automationexercise.com.
 *   `mes` e o nome do mes em ingles (ex.: "September"), formato aceito pelo select da pagina.
 *   `pais` e sempre um dos valores existentes no select da pagina.
 */
function gerarUsuario() {
  const primeiroNome = faker.person.firstName()
  const sobrenome = faker.person.lastName()
  const meses = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December']
  const paises = ['India', 'United States', 'Canada', 'Australia', 'Israel', 'New Zealand', 'Singapore']

  return {
    nome: `${primeiroNome} ${sobrenome}`,
    email: faker.internet.email({ firstName: primeiroNome, lastName: `${sobrenome}.${Date.now()}` }).toLowerCase(),
    senha: faker.internet.password({ length: 10 }),
    titulo: faker.helpers.arrayElement(['Mr', 'Mrs']),
    dia: String(faker.number.int({ min: 1, max: 28 })),
    mes: faker.helpers.arrayElement(meses),
    ano: String(faker.number.int({ min: 1950, max: 2005 })),
    primeiroNome,
    sobrenome,
    empresa: faker.company.name(),
    endereco: faker.location.streetAddress(),
    endereco2: faker.location.secondaryAddress(),
    pais: faker.helpers.arrayElement(paises),
    estado: faker.location.state(),
    cidade: faker.location.city(),
    cep: faker.location.zipCode('#####'),
    celular: faker.string.numeric(11),
  }
}

/**
 * Gera dados ficticios de cartao de credito para a etapa de pagamento.
 *
 * @returns {{ nome: string, numero: string, cvc: string, mesValidade: string, anoValidade: string }}
 *   Dados do cartao: nome impresso, numero (16 digitos), CVC (3 digitos), mes (MM) e ano (YYYY) de validade.
 */
function gerarCartao() {
  return {
    nome: faker.person.fullName(),
    numero: faker.finance.creditCardNumber('################'),
    cvc: faker.finance.creditCardCVV(),
    mesValidade: String(faker.number.int({ min: 1, max: 12 })).padStart(2, '0'),
    anoValidade: String(faker.number.int({ min: 2027, max: 2032 })),
  }
}

/**
 * Acessa a pagina inicial da aplicacao (baseUrl do cypress.config.js) e verifica
 * que ela foi carregada com sucesso, validando a presenca do banner principal.
 *
 * @returns {void} Nao retorna valor; encadeia comandos Cypress.
 */
function acessarPaginaInicial() {
  cy.visit('/')
  cy.get(seletores.bannerPrincipal).should('be.visible')
}

/**
 * Cria um usuario diretamente pela API publica da aplicacao (POST /api/createAccount),
 * usado como preparacao (arrange) de testes que precisam de um usuario ja existente.
 * Nao falha se o e-mail ja estiver cadastrado.
 *
 * @param {ReturnType<typeof gerarUsuario>} usuario - Objeto no formato retornado por gerarUsuario().
 * @returns {Cypress.Chainable<Cypress.Response<any>>} Chainable com a resposta HTTP da API.
 */
function criarUsuarioViaApi(usuario) {
  const mesNumero = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December'].indexOf(usuario.mes) + 1

  return cy.request({
    method: 'POST',
    url: '/api/createAccount',
    form: true,
    failOnStatusCode: false,
    body: {
      name: usuario.nome,
      email: usuario.email,
      password: usuario.senha,
      title: usuario.titulo,
      birth_date: usuario.dia,
      birth_month: String(mesNumero),
      birth_year: usuario.ano,
      firstname: usuario.primeiroNome,
      lastname: usuario.sobrenome,
      company: usuario.empresa,
      address1: usuario.endereco,
      address2: usuario.endereco2,
      country: usuario.pais,
      zipcode: usuario.cep,
      state: usuario.estado,
      city: usuario.cidade,
      mobile_number: usuario.celular,
    },
  })
}

module.exports = {
  seletores,
  gerarUsuario,
  gerarCartao,
  acessarPaginaInicial,
  criarUsuarioViaApi,
}
