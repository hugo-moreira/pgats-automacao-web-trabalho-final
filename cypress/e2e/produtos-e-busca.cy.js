/// <reference types="cypress" />

// Trabalho Final - Casos de teste 8 e 9 de https://www.automationexercise.com/test_cases
//   TC8 - Verify All Products and product detail page
//   TC9 - Search Product

const commons = require('../modules/commons')
const produtos = require('../modules/produtos')
const dados = require('../fixtures/dados-de-teste.json')

describe('Automation Exercise - Produtos e Busca (TC 8 e 9)', () => {
  beforeEach(() => {
    commons.acessarPaginaInicial()
    produtos.acessarProdutos()
  })

  it('Test Case 8: Verificar a página de todos os produtos e o detalhe de um produto', () => {
    produtos.verificarSeListaDeProdutosEstaVisivel()
    produtos.abrirDetalhesDoPrimeiroProduto()
    produtos.verificarDetalhesDoProduto()
  })

  it('Test Case 9: Buscar produto', () => {
    produtos.buscarProduto(dados.busca.termo)
    produtos.verificarResultadosDaBusca(dados.busca.termo)
  })
})
