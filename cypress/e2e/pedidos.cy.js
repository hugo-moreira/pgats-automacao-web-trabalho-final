/// <reference types="cypress" />

// Trabalho Final - Casos de teste 15 e 16 de https://www.automationexercise.com/test_cases
//   TC15 - Place Order: Register before Checkout
//   TC16 - Place Order: Login before Checkout
//
// Os fluxos repetidos (cadastro/login, adicionar ao carrinho e finalizar compra) estao
// agrupados no modulo `fluxos` (padrao Workflow/Facade), que reutiliza os modulos de
// cadastro, login, produtos, carrinho e checkout.

const commons = require('../modules/commons')
const cadastro = require('../modules/cadastro')
const fluxos = require('../modules/fluxos')
const dados = require('../fixtures/dados-de-teste.json')

describe('Automation Exercise - Pedidos (TC 15 e 16)', () => {
  beforeEach(() => {
    commons.acessarPaginaInicial()
  })

  it('Test Case 15: Realizar pedido cadastrando-se antes do checkout', () => {
    const usuario = commons.gerarUsuario()
    const cartao = commons.gerarCartao()

    fluxos.cadastrarNovoUsuarioPelaInterface(usuario)
    fluxos.adicionarProdutosAoCarrinho(2)
    fluxos.finalizarCompra(usuario, cartao, dados.pedido.comentario)
    cadastro.excluirConta()
  })

  it('Test Case 16: Realizar pedido efetuando login antes do checkout', () => {
    const usuario = commons.gerarUsuario()
    const cartao = commons.gerarCartao()

    // Preparacao: o usuario precisa existir antes do login (criado via API).
    commons.criarUsuarioViaApi(usuario)

    fluxos.autenticarUsuarioExistente(usuario)
    fluxos.adicionarProdutosAoCarrinho(1)
    fluxos.finalizarCompra(usuario, cartao, dados.pedido.comentario)
    cadastro.excluirConta()
  })
})
