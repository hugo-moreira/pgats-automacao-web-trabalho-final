/// <reference types="cypress" />

// Trabalho Final - Casos de teste 1 a 5 de https://www.automationexercise.com/test_cases
//   TC1 - Register User
//   TC2 - Login User with correct email and password
//   TC3 - Login User with incorrect email and password
//   TC4 - Logout User
//   TC5 - Register User with existing email

const commons = require('../modules/commons')
const cadastro = require('../modules/cadastro')
const login = require('../modules/login')
const dados = require('../fixtures/dados-de-teste.json')

describe('Automation Exercise - Cadastro e Login (TC 1, 2, 3, 4 e 5)', () => {
  // Usuario fixo da suite: gerado uma unica vez com dados dinamicos e criado via API
  // antes dos testes que exigem um usuario previamente existente (TC2, TC4 e TC5).
  const usuarioExistente = commons.gerarUsuario()

  before(() => {
    commons.criarUsuarioViaApi(usuarioExistente)
  })

  beforeEach(() => {
    commons.acessarPaginaInicial()
    cadastro.acessarPaginaDeLogin()
  })

  after(() => {
    // Limpeza: remove o usuario fixo criado para a suite.
    commons.acessarPaginaInicial()
    cadastro.acessarPaginaDeLogin()
    login.preencherLogin(usuarioExistente.email, usuarioExistente.senha)
    cadastro.excluirConta()
  })

  it('Test Case 1: Cadastrar um novo usuário com sucesso', () => {
    const novoUsuario = commons.gerarUsuario()

    cadastro.iniciarCadastro(novoUsuario.nome, novoUsuario.email)
    cadastro.preencherCadastro(novoUsuario)
    cadastro.verificarSeCadastroFoiEfetuadoComSucesso()
    login.verificarSeLoginFoiEfetuadoComSucesso(novoUsuario.nome)
    cadastro.excluirConta()
  })

  it('Test Case 2: Efetuar login de usuário com e-mail e senha corretos', () => {
    login.preencherLogin(usuarioExistente.email, usuarioExistente.senha)
    login.verificarSeLoginFoiEfetuadoComSucesso(usuarioExistente.nome)
  })

  it('Test Case 3: Efetuar login de usuário com e-mail e senha incorretos', () => {
    login.preencherLogin(dados.credenciaisInvalidas.email, dados.credenciaisInvalidas.senha)
    login.verificarSeMensagemDeErroFoiExibidaNoLogin()
  })

  it('Test Case 4: Efetuar logout de usuário', () => {
    login.preencherLogin(usuarioExistente.email, usuarioExistente.senha)
    login.verificarSeLoginFoiEfetuadoComSucesso(usuarioExistente.nome)
    login.efetuarLogout()
    login.verificarSeUsuarioFoiDeslogado()
  })

  it('Test Case 5: Cadastrar usuário com e-mail já existente', () => {
    cadastro.iniciarCadastro(usuarioExistente.nome, usuarioExistente.email)
    cadastro.verificarSeMensagemDeCadastroExistenteFoiExibida()
  })
})
