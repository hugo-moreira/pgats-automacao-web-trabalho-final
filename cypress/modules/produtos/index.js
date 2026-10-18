/// <reference types="cypress" />

// Modulo de acoes de negocio relacionadas a PRODUTOS (listagem, busca, detalhe, adicionar ao carrinho).

const seletores = {
  linkProdutos: 'a[href="/products"]',
  tituloPagina: 'h2.title',
  listaProdutos: '.features_items .product-image-wrapper',
  linkVerProduto: '.features_items .choose a[href*="product_details"]',
  informacoesProduto: '.product-information',
  nomeProduto: '.product-information h2',
  categoriaProduto: '.product-information p',
  precoProduto: '.product-information span span',
  campoBusca: '#search_product',
  botaoBuscar: '#submit_search',
  nomeNaListagem: '.features_items .productinfo p',
  botaoAdicionarAoCarrinho: '.features_items .productinfo a.add-to-cart',
  modalAdicionado: '#cartModal',
  modalTitulo: '#cartModal .modal-title',
  modalLinkVerCarrinho: '#cartModal a[href="/view_cart"]',
  modalBotaoContinuar: '#cartModal .close-modal',
}

/**
 * Acessa a pagina "Products" pelo menu superior e verifica que o usuario chegou
 * em "All Products" (URL contem /products e titulo visivel).
 *
 * @returns {void} Nao retorna valor; encadeia comandos Cypress.
 */
function acessarProdutos() {
  cy.get(seletores.linkProdutos).click()
  cy.url().should('include', '/products')
  cy.contains(seletores.tituloPagina, 'All Products').should('be.visible')
}

/**
 * Verifica que a lista de produtos esta visivel e possui ao menos um item.
 *
 * @returns {void} Nao retorna valor; encadeia comandos Cypress.
 */
function verificarSeListaDeProdutosEstaVisivel() {
  cy.get(seletores.listaProdutos).should('be.visible').and('have.length.greaterThan', 0)
}

/**
 * Clica em "View Product" do primeiro produto da listagem e verifica que a pagina
 * de detalhe foi aberta (URL contem /product_details).
 *
 * @returns {void} Nao retorna valor; encadeia comandos Cypress.
 */
function abrirDetalhesDoPrimeiroProduto() {
  cy.get(seletores.linkVerProduto).first().click()
  cy.url().should('include', '/product_details')
}

/**
 * Verifica que a pagina de detalhe exibe nome, categoria, preco, disponibilidade,
 * condicao e marca do produto.
 *
 * @returns {void} Nao retorna valor; encadeia comandos Cypress.
 */
function verificarDetalhesDoProduto() {
  cy.get(seletores.informacoesProduto).should('be.visible')
  cy.get(seletores.nomeProduto).should('be.visible').and('not.be.empty')
  cy.contains(seletores.categoriaProduto, 'Category:').should('be.visible')
  cy.get(seletores.precoProduto).should('be.visible').and('contain', 'Rs.')
  cy.contains(seletores.categoriaProduto, 'Availability:').should('be.visible')
  cy.contains(seletores.categoriaProduto, 'Condition:').should('be.visible')
  cy.contains(seletores.categoriaProduto, 'Brand:').should('be.visible')
}

/**
 * Digita um termo no campo de busca da pagina de produtos e clica no botao de pesquisa.
 *
 * Pre-condicao: estar na pagina /products.
 *
 * @param {string} termo - Nome (ou parte do nome) do produto a pesquisar (ex.: "Dress").
 * @returns {void} Nao retorna valor; encadeia comandos Cypress.
 */
function buscarProduto(termo) {
  cy.get(seletores.campoBusca).type(termo)
  cy.get(seletores.botaoBuscar).click()
}

/**
 * Verifica que o titulo "Searched Products" esta visivel, que ha produtos listados e que
 * os resultados sao relacionados ao termo pesquisado.
 *
 * Observacao: a busca do automationexercise.com tambem considera a categoria do produto
 * (ex.: "Dress" retorna "Sleeves Top and Short", da categoria Women > Dress). Por isso a
 * assercao exige que ao menos um resultado contenha o termo no nome, e nao todos.
 *
 * @param {string} termo - Termo utilizado na busca.
 * @returns {void} Nao retorna valor; encadeia comandos Cypress.
 */
function verificarResultadosDaBusca(termo) {
  cy.contains(seletores.tituloPagina, 'Searched Products').should('be.visible')
  cy.get(seletores.listaProdutos).should('be.visible').and('have.length.greaterThan', 0)
  cy.get(seletores.nomeNaListagem).then(($nomes) => {
    const nomes = $nomes.toArray().map((el) => el.innerText.toLowerCase())
    const relacionados = nomes.filter((nome) => nome.includes(termo.toLowerCase()))
    expect(relacionados, `produtos com "${termo}" no nome`).to.have.length.greaterThan(0)
  })
}

/**
 * Adiciona ao carrinho o produto na posicao informada da listagem e verifica que o
 * modal "Added!" foi exibido.
 *
 * Pre-condicao: estar em uma pagina com listagem de produtos (home ou /products).
 *
 * @param {number} [indice=0] - Posicao do produto na listagem (0 = primeiro).
 * @returns {void} Nao retorna valor; encadeia comandos Cypress.
 */
function adicionarProdutoAoCarrinho(indice = 0) {
  cy.get(seletores.botaoAdicionarAoCarrinho).eq(indice).click({ force: true })
  cy.get(seletores.modalAdicionado).should('be.visible')
  cy.get(seletores.modalTitulo).should('contain', 'Added!')
}

/**
 * Fecha o modal "Added!" clicando em "Continue Shopping" para seguir adicionando produtos.
 *
 * Pre-condicao: modal "Added!" visivel.
 *
 * @returns {void} Nao retorna valor; encadeia comandos Cypress.
 */
function continuarComprando() {
  cy.get(seletores.modalBotaoContinuar).click()
  cy.get(seletores.modalAdicionado).should('not.be.visible')
}

/**
 * Clica em "View Cart" dentro do modal "Added!" e verifica que a pagina do carrinho foi aberta.
 *
 * Pre-condicao: modal "Added!" visivel.
 *
 * @returns {void} Nao retorna valor; encadeia comandos Cypress.
 */
function irParaCarrinhoPeloModal() {
  cy.get(seletores.modalLinkVerCarrinho).click()
  cy.url().should('include', '/view_cart')
}

module.exports = {
  seletores,
  acessarProdutos,
  verificarSeListaDeProdutosEstaVisivel,
  abrirDetalhesDoPrimeiroProduto,
  verificarDetalhesDoProduto,
  buscarProduto,
  verificarResultadosDaBusca,
  adicionarProdutoAoCarrinho,
  continuarComprando,
  irParaCarrinhoPeloModal,
}
