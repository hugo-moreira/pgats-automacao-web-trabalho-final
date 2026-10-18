# Documentação das funções do projeto

Documento único com a docstring de todas as funções criadas no projeto. As mesmas docstrings (JSDoc) estão no código-fonte de cada módulo; este arquivo as consolida para consulta rápida.

Convenções (diretrizes de arquitetura da disciplina, Aulas 6 e 9):

- Um módulo por funcionalidade em `cypress/modules/<funcionalidade>/index.js`, exportado com `module.exports`.
- Seletores agrupados na constante `seletores` de cada módulo (também exportada).
- Asserções ficam dentro dos módulos; as specs apenas orquestram chamadas.
- O módulo `fluxos` (padrão Workflow/Facade) não possui seletores próprios: apenas compõe funções dos demais módulos.
- Todas as funções que executam comandos Cypress retornam `void`: elas enfileiram comandos na cadeia do Cypress e não devolvem valores síncronos. A exceção é `criarUsuarioViaApi`, que retorna o `Chainable` de `cy.request`.

---

## Módulo `commons` (`cypress/modules/commons/index.js`)

Utilitários transversais: geração de dados dinâmicos com `@faker-js/faker`, navegação inicial e preparação de massa via API.

### `gerarUsuario()`

Gera um usuário completo com dados dinâmicos. O e-mail recebe um sufixo com `Date.now()` para garantir unicidade mesmo que o faker sorteie o mesmo nome em execuções diferentes (evita o erro "Email Address already exist!").

- Argumentos: nenhum.
- Retorno: objeto com os campos `nome`, `email`, `senha`, `titulo` (`'Mr'` ou `'Mrs'`), `dia`, `mes` (nome do mês em inglês, ex.: `"September"`, formato aceito pelo select da página), `ano`, `primeiroNome`, `sobrenome`, `empresa`, `endereco`, `endereco2`, `pais` (sempre um dos valores existentes no select: India, United States, Canada, Australia, Israel, New Zealand, Singapore), `estado`, `cidade`, `cep`, `celular`. Todos os valores são strings.

### `gerarCartao()`

Gera dados fictícios de cartão de crédito para a etapa de pagamento.

- Argumentos: nenhum.
- Retorno: objeto `{ nome, numero, cvc, mesValidade, anoValidade }`: nome impresso, número com 16 dígitos, CVC com 3 dígitos, mês (`MM`) e ano (`YYYY`) de validade.

### `acessarPaginaInicial()`

Acessa a página inicial da aplicação (`baseUrl` do `cypress.config.js`) e verifica que ela foi carregada, validando a presença do banner principal (`#slider`).

- Argumentos: nenhum.
- Retorno: `void`.

### `criarUsuarioViaApi(usuario)`

Cria um usuário diretamente pela API pública da aplicação (`POST /api/createAccount`). Usada como preparação (arrange) de testes que precisam de um usuário já existente. Não falha se o e-mail já estiver cadastrado (`failOnStatusCode: false`). Converte o nome do mês para número, como a API exige.

- Argumentos:
  - `usuario` (object): objeto no formato retornado por `gerarUsuario()`.
- Retorno: `Cypress.Chainable<Cypress.Response>` com a resposta HTTP da API.

---

## Módulo `cadastro` (`cypress/modules/cadastro/index.js`)

### `acessarPaginaDeLogin()`

Acessa a página "Signup / Login" a partir do menu superior e verifica que os blocos "New User Signup!" e "Login to your account" estão visíveis. Pré-condição: estar em qualquer página que exiba o menu superior.

- Argumentos: nenhum.
- Retorno: `void`.

### `iniciarCadastro(nome, email)`

Preenche nome e e-mail no bloco "New User Signup!" e clica em "Signup". Pré-condição: estar em `/login`.

- Argumentos:
  - `nome` (string): nome completo do novo usuário (exibido depois em "Logged in as <nome>").
  - `email` (string): e-mail único ainda não cadastrado.
- Retorno: `void`.

### `preencherCadastro(usuario)`

Preenche o formulário "Enter Account Information" completo (título, senha, data de nascimento, newsletter, ofertas, nome, empresa, endereço, país, estado, cidade, CEP, celular) e clica em "Create Account". Pré-condição: `iniciarCadastro()` já executado com e-mail inédito.

- Argumentos:
  - `usuario` (object) com: `titulo` (`'Mr'`/`'Mrs'`, define o radio de gênero), `senha`, `dia` (1 a 31), `mes` (inglês), `ano`, `primeiroNome`, `sobrenome`, `empresa`, `endereco`, `endereco2`, `pais` (deve existir no select), `estado`, `cidade`, `cep`, `celular`. Todos strings.
- Retorno: `void`.

### `verificarSeCadastroFoiEfetuadoComSucesso()`

Verifica que a página "Account Created!" foi exibida e clica em "Continue", voltando à home autenticado.

- Argumentos: nenhum.
- Retorno: `void`.

### `verificarSeMensagemDeCadastroExistenteFoiExibida()`

Verifica que a mensagem "Email Address already exist!" foi exibida ao tentar iniciar cadastro com e-mail já utilizado.

- Argumentos: nenhum.
- Retorno: `void`.

### `excluirConta()`

Exclui a conta do usuário autenticado pelo link "Delete Account", verifica "Account Deleted!" e clica em "Continue". Usada como limpeza (teardown). Pré-condição: usuário autenticado.

- Argumentos: nenhum.
- Retorno: `void`.

---

## Módulo `login` (`cypress/modules/login/index.js`)

### `preencherLogin(email, senha)`

Preenche e-mail e senha no bloco "Login to your account" e clica em "Login". Pré-condição: estar em `/login`.

- Argumentos:
  - `email` (string): e-mail (válido ou inválido, conforme o cenário).
  - `senha` (string): senha (válida ou inválida). Digitada com `{ log: false }` para não aparecer no log.
- Retorno: `void`.

### `verificarSeLoginFoiEfetuadoComSucesso(nome)`

Verifica que o menu superior exibe "Logged in as <nome>".

- Argumentos:
  - `nome` (string): nome esperado no menu.
- Retorno: `void`.

### `verificarSeMensagemDeErroFoiExibidaNoLogin()`

Verifica que a mensagem "Your email or password is incorrect!" foi exibida.

- Argumentos: nenhum.
- Retorno: `void`.

### `efetuarLogout()`

Clica no link "Logout" do menu superior. Pré-condição: usuário autenticado.

- Argumentos: nenhum.
- Retorno: `void`.

### `verificarSeUsuarioFoiDeslogado()`

Verifica que o formulário de login está visível, que a URL contém "login" e que o link "Logout" não existe mais.

- Argumentos: nenhum.
- Retorno: `void`.

---

## Módulo `produtos` (`cypress/modules/produtos/index.js`)

### `acessarProdutos()`

Clica em "Products" no menu e verifica URL `/products` e título "All Products".

- Argumentos: nenhum.
- Retorno: `void`.

### `verificarSeListaDeProdutosEstaVisivel()`

Verifica que a lista de produtos está visível e tem ao menos um item.

- Argumentos: nenhum.
- Retorno: `void`.

### `abrirDetalhesDoPrimeiroProduto()`

Clica em "View Product" do primeiro produto e verifica URL `/product_details`.

- Argumentos: nenhum.
- Retorno: `void`.

### `verificarDetalhesDoProduto()`

Verifica nome, categoria, preço (contém "Rs."), disponibilidade, condição e marca na página de detalhe.

- Argumentos: nenhum.
- Retorno: `void`.

### `buscarProduto(termo)`

Digita o termo no campo `#search_product` e clica em `#submit_search`. Pré-condição: estar em `/products`.

- Argumentos:
  - `termo` (string): nome ou parte do nome do produto (ex.: `"Dress"`).
- Retorno: `void`.

### `verificarResultadosDaBusca(termo)`

Verifica título "Searched Products", que há produtos listados e que os resultados são relacionados ao termo. Como a busca do site também considera a categoria (ex.: "Dress" retorna "Sleeves Top and Short", da categoria Women > Dress), exige-se que ao menos um resultado contenha o termo no nome, e não todos.

- Argumentos:
  - `termo` (string): termo utilizado na busca.
- Retorno: `void`.

### `adicionarProdutoAoCarrinho(indice = 0)`

Clica em "Add to cart" do produto na posição informada e verifica o modal "Added!". Usa `{ force: true }` porque o botão fica sob uma camada de hover. Pré-condição: estar em página com listagem (home ou `/products`).

- Argumentos:
  - `indice` (number, opcional, padrão `0`): posição do produto na listagem (0 = primeiro).
- Retorno: `void`.

### `continuarComprando()`

Clica em "Continue Shopping" no modal "Added!" e verifica que ele fechou.

- Argumentos: nenhum.
- Retorno: `void`.

### `irParaCarrinhoPeloModal()`

Clica em "View Cart" no modal "Added!" e verifica URL `/view_cart`.

- Argumentos: nenhum.
- Retorno: `void`.

---

## Módulo `carrinho` (`cypress/modules/carrinho/index.js`)

Ações de negócio da página do carrinho de compras.

### `acessarCarrinho()`

Clica em "Cart" no menu e chama `verificarSePaginaDoCarrinhoFoiExibida()`.

- Argumentos: nenhum.
- Retorno: `void`.

### `verificarSePaginaDoCarrinhoFoiExibida()`

Verifica URL `/view_cart` e tabela `#cart_info_table` visível.

- Argumentos: nenhum.
- Retorno: `void`.

### `verificarQuantidadeDeItensNoCarrinho(quantidade)`

Verifica que o carrinho possui exatamente a quantidade de linhas (produtos distintos) informada.

- Argumentos:
  - `quantidade` (number): número esperado de itens.
- Retorno: `void`.

### `prosseguirParaCheckout()`

Clica em "Proceed To Checkout" e verifica URL `/checkout`. Pré-condição: usuário autenticado e carrinho com itens.

- Argumentos: nenhum.
- Retorno: `void`.

---

## Módulo `checkout` (`cypress/modules/checkout/index.js`)

### `verificarEnderecoEResumoDoPedido(usuario)`

Verifica as seções "Address Details" e "Review Your Order", confere que os endereços de entrega e cobrança contêm os dados do usuário e que a tabela de revisão e o total (`Rs.`) estão visíveis. Pré-condição: estar em `/checkout`.

- Argumentos:
  - `usuario` (object) com `primeiroNome`, `sobrenome`, `endereco`, `cidade`, `pais`, `celular` (strings).
- Retorno: `void`.

### `adicionarComentarioEFinalizarPedido(comentario)`

Preenche o comentário do pedido, clica em "Place Order" e verifica URL `/payment`.

- Argumentos:
  - `comentario` (string): observação do pedido.
- Retorno: `void`.

### `preencherPagamento(cartao)`

Preenche nome, número, CVC, mês e ano do cartão e clica em "Pay and Confirm Order". Pré-condição: estar em `/payment`.

- Argumentos:
  - `cartao` (object) com `nome`, `numero`, `cvc`, `mesValidade` (`MM`), `anoValidade` (`YYYY`).
- Retorno: `void`.

### `verificarSePedidoFoiRealizadoComSucesso()`

Verifica que o pedido foi concluído. A aplicação exibe por um instante "Your order has been placed successfully!" e redireciona para `/payment_done`, com "Order Placed!" e "Congratulations! Your order has been confirmed!". Como a mensagem intermediária some rapidamente, a asserção é feita no estado final estável.

- Argumentos: nenhum.
- Retorno: `void`.

---

## Módulo `assinatura` (`cypress/modules/assinatura/index.js`)

Ações de negócio da assinatura da newsletter (bloco "Subscription" no rodapé da página).

### `rolarAteAssinaturaNoRodape()`

Rola até o rodapé e verifica o título "Subscription".

- Argumentos: nenhum.
- Retorno: `void`.

### `assinarNewsletter(email)`

Preenche o e-mail no campo de assinatura do rodapé e clica no botão de seta.

- Argumentos:
  - `email` (string): e-mail a cadastrar na newsletter.
- Retorno: `void`.

### `verificarSeAssinaturaFoiEfetuadaComSucesso()`

Verifica a mensagem "You have been successfully subscribed!".

- Argumentos: nenhum.
- Retorno: `void`.

---

## Módulo `fluxos` (`cypress/modules/fluxos/index.js`)

Padrão Workflow/Facade (Aula 9): agrupa sequências de ações de negócio repetidas em vários testes, reutilizando as funções dos módulos `cadastro`, `login`, `produtos`, `carrinho` e `checkout`. Não possui seletores próprios.

### `cadastrarNovoUsuarioPelaInterface(usuario)`

Executa o fluxo completo de cadastro pela interface: "Signup / Login" > "New User Signup!" (nome e e-mail) > formulário "Enter Account Information" > "Account Created!" > "Continue", e verifica que o menu exibe "Logged in as <nome>". Pré-condição: estar na página inicial.

- Argumentos:
  - `usuario` (object): objeto no formato retornado por `commons.gerarUsuario()` (usa `nome`, `email` e todos os campos do formulário).
- Retorno: `void`.

### `autenticarUsuarioExistente(usuario)`

Executa o fluxo de login: "Signup / Login" > preenche e-mail e senha > "Login", e verifica "Logged in as <nome>". Pré-condição: estar na página inicial e o usuário já existir (ex.: criado por `commons.criarUsuarioViaApi`).

- Argumentos:
  - `usuario` (object) com `nome` (string, exibido após o login), `email` (string) e `senha` (string).
- Retorno: `void`.

### `adicionarProdutosAoCarrinho(quantidade)`

Adiciona `quantidade` produtos distintos da listagem ao carrinho (índices 0 até `quantidade - 1`), clicando em "Continue Shopping" entre um produto e outro e em "View Cart" após o último; em seguida verifica que a página do carrinho foi exibida com exatamente `quantidade` itens. Pré-condição: estar em página que liste produtos (inicial ou `/products`).

- Argumentos:
  - `quantidade` (number): número de produtos distintos a adicionar (mínimo 1).
- Retorno: `void`.

### `finalizarCompra(usuario, cartao, comentario)`

Executa o checkout e o pagamento a partir da página do carrinho: "Proceed To Checkout" > confere "Address Details" e "Review Your Order" com os dados do usuário > preenche o comentário e clica em "Place Order" > preenche os dados do cartão e clica em "Pay and Confirm Order" > verifica a confirmação em `/payment_done` ("Order Placed!" e "Congratulations! Your order has been confirmed!"). Pré-condição: usuário autenticado, carrinho com itens, estando em `/view_cart`.

- Argumentos:
  - `usuario` (object): formato de `commons.gerarUsuario()` (usa `primeiroNome`, `sobrenome`, `endereco`, `cidade`, `pais`, `celular`).
  - `cartao` (object): formato de `commons.gerarCartao()` (`nome`, `numero`, `cvc`, `mesValidade`, `anoValidade`).
  - `comentario` (string): observação a ser registrada no pedido.
- Retorno: `void`.

---

## Comandos customizados (`cypress/support/commands.js`)

Nenhum comando customizado foi definido. Todas as ações de negócio estão nos módulos acima, seguindo as diretrizes de arquitetura da disciplina (evitar abstrações duplicadas sem reutilização).

## Dados de teste (`cypress/fixtures/dados-de-teste.json`)

Dados estáticos separados do código: `credenciaisInvalidas` (e-mail e senha inexistentes para o TC3), `busca.termo` (termo pesquisado no TC9) e `pedido.comentario` (observação enviada no checkout dos TC15 e TC16). Dados que precisam ser únicos (usuários, cartão, e-mail da newsletter) são gerados dinamicamente por `commons.gerarUsuario()`, `commons.gerarCartao()` e `Date.now()`.
