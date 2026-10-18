/// <reference types="cypress" />

// Modulo de FLUXOS (padrao Workflow/Facade - Aula 9): agrupa sequencias de acoes de
// negocio que se repetem em varios testes, reutilizando as funcoes dos demais modulos.
// Nao possui seletores proprios: toda interacao com a tela e delegada aos modulos de
// funcionalidade (cadastro, login, produtos, carrinho e checkout).

const cadastro = require('../cadastro')
const login = require('../login')
const produtos = require('../produtos')
const carrinho = require('../carrinho')
const checkout = require('../checkout')

/**
 * Executa o fluxo completo de cadastro de um novo usuario pela interface
 * (Signup / Login -> New User Signup -> formulario -> Account Created -> Continue)
 * e verifica que o usuario ficou autenticado.
 *
 * Pre-condicao: estar na pagina inicial da aplicacao.
 *
 * @param {ReturnType<typeof import('../commons').gerarUsuario>} usuario - Usuario gerado por commons.gerarUsuario().
 * @returns {void} Nao retorna valor; encadeia comandos Cypress.
 */
function cadastrarNovoUsuarioPelaInterface(usuario) {
  cadastro.acessarPaginaDeLogin()
  cadastro.iniciarCadastro(usuario.nome, usuario.email)
  cadastro.preencherCadastro(usuario)
  cadastro.verificarSeCadastroFoiEfetuadoComSucesso()
  login.verificarSeLoginFoiEfetuadoComSucesso(usuario.nome)
}

/**
 * Executa o fluxo de autenticacao de um usuario ja existente
 * (Signup / Login -> preencher e-mail e senha -> Login) e verifica que ficou autenticado.
 *
 * Pre-condicao: estar na pagina inicial e o usuario existir na aplicacao.
 *
 * @param {{ nome: string, email: string, senha: string }} usuario - Credenciais e nome exibido apos o login.
 * @returns {void} Nao retorna valor; encadeia comandos Cypress.
 */
function autenticarUsuarioExistente(usuario) {
  cadastro.acessarPaginaDeLogin()
  login.preencherLogin(usuario.email, usuario.senha)
  login.verificarSeLoginFoiEfetuadoComSucesso(usuario.nome)
}

/**
 * Adiciona N produtos distintos da pagina inicial ao carrinho (indices 0..quantidade-1),
 * abre o carrinho pelo modal e verifica que a quantidade de itens esta correta.
 *
 * Pre-condicao: estar em uma pagina que liste produtos (inicial ou /products).
 *
 * @param {number} quantidade - Quantidade de produtos distintos a adicionar (minimo 1).
 * @returns {void} Nao retorna valor; encadeia comandos Cypress.
 */
function adicionarProdutosAoCarrinho(quantidade) {
  for (let indice = 0; indice < quantidade; indice++) {
    produtos.adicionarProdutoAoCarrinho(indice)
    if (indice < quantidade - 1) {
      produtos.continuarComprando()
    }
  }
  produtos.irParaCarrinhoPeloModal()
  carrinho.verificarSePaginaDoCarrinhoFoiExibida()
  carrinho.verificarQuantidadeDeItensNoCarrinho(quantidade)
}

/**
 * Executa o fluxo de checkout e pagamento a partir da pagina do carrinho:
 * Proceed To Checkout -> confere endereco e resumo -> comentario + Place Order ->
 * dados do cartao + Pay and Confirm Order -> verifica mensagem de pedido realizado.
 *
 * Pre-condicao: usuario autenticado e carrinho com itens, estando na pagina /view_cart.
 *
 * @param {ReturnType<typeof import('../commons').gerarUsuario>} usuario - Usuario autenticado (para conferir o endereco).
 * @param {ReturnType<typeof import('../commons').gerarCartao>} cartao - Dados do cartao gerados por commons.gerarCartao().
 * @param {string} comentario - Texto a ser informado no campo de comentario do pedido.
 * @returns {void} Nao retorna valor; encadeia comandos Cypress.
 */
function finalizarCompra(usuario, cartao, comentario) {
  carrinho.prosseguirParaCheckout()
  checkout.verificarEnderecoEResumoDoPedido(usuario)
  checkout.adicionarComentarioEFinalizarPedido(comentario)
  checkout.preencherPagamento(cartao)
  checkout.verificarSePedidoFoiRealizadoComSucesso()
}

module.exports = {
  cadastrarNovoUsuarioPelaInterface,
  autenticarUsuarioExistente,
  adicionarProdutosAoCarrinho,
  finalizarCompra,
}
