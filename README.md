# PGATS3 - Trabalho Final - Automação de Testes na Camada de Interface (Web)

[![Testes E2E - Automation Exercise](https://github.com/hugo-moreira/pgats-automacao-web-trabalho-final/actions/workflows/cypress.yml/badge.svg)](https://github.com/hugo-moreira/pgats-automacao-web-trabalho-final/actions/workflows/cypress.yml)


Projeto individual de conclusão da disciplina **Automação de Testes na Camada de Interface (Web)** (PGATS3), professor Samuel Lucas.
Automatiza, com **Cypress**, os casos de teste **1, 2, 3, 4, 5, 8, 9, 10, 15 e 16** da página
[Test Cases](https://www.automationexercise.com/test_cases) da aplicação fictícia
[Automation Exercise](https://www.automationexercise.com).

Aluno: **Hugo Moreira**

## Casos de teste implementados

| TC | Nome original | Spec | Status |
|----|---------------|------|--------|
| 1 | Register User | `cypress/e2e/cadastro-e-login.cy.js` | OK |
| 2 | Login User with correct email and password | `cypress/e2e/cadastro-e-login.cy.js` | OK |
| 3 | Login User with incorrect email and password | `cypress/e2e/cadastro-e-login.cy.js` | OK |
| 4 | Logout User | `cypress/e2e/cadastro-e-login.cy.js` | OK |
| 5 | Register User with existing email | `cypress/e2e/cadastro-e-login.cy.js` | OK |
| 8 | Verify All Products and product detail page | `cypress/e2e/produtos-e-busca.cy.js` | OK |
| 9 | Search Product | `cypress/e2e/produtos-e-busca.cy.js` | OK |
| 10 | Verify Subscription in home page | `cypress/e2e/assinatura.cy.js` | OK |
| 15 | Place Order: Register before Checkout | `cypress/e2e/pedidos.cy.js` | OK |
| 16 | Place Order: Login before Checkout | `cypress/e2e/pedidos.cy.js` | OK |

Última execução local completa: **10 testes, 10 aprovados, 0 falhas, ~2 min** (Electron headless).

## Tecnologias

| Item | Versão |
|------|--------|
| Node.js | 20+ (testado com 24.x) |
| Cypress | 13.7.3 (fixada) |
| cypress-mochawesome-reporter | 3.8.x (relatório HTML) |
| @faker-js/faker | 10.x (dados dinâmicos) |
| GitHub Actions | `ubuntu-latest` |

## Como executar localmente

```bash
# 1. Instalar dependencias
npm install

# 2. Executar toda a suite em modo headless (gera relatorio em cypress/reports)
npm test

# 3. Executar no Chrome em modo headless
npm run test:chrome

# 4. Abrir o Cypress em modo interativo
npm run cy:open

# 5. Executar uma spec especifica
npm run test:cadastro-login
npm run test:produtos
npm run test:assinatura
npm run test:pedidos

# 6. Abrir o relatorio HTML gerado na ultima execucao
npm run relatorio     # ou abra cypress/reports/index.html no navegador
```

Observação (Linux, terminal integrado de alguns editores): se o Cypress falhar com `bad option: --no-sandbox`,
execute com `env -u ELECTRON_RUN_AS_NODE npx cypress run`.

## Execução via GitHub Actions

O workflow [`.github/workflows/cypress.yml`](.github/workflows/cypress.yml) executa a suíte completa em `ubuntu-latest`:

1. Gatilhos: `workflow_dispatch` (manual, pela aba **Actions > Testes E2E - Automation Exercise > Run workflow**), `push` e `pull_request` na branch `main`.
2. Passos: checkout, Node.js 20 com cache do npm, `npm ci`, `npx cypress run --browser electron`.
3. Artefatos publicados ao final da execução (aba **Summary** do run, seção **Artifacts**):
   - `relatorio-mochawesome`: relatório HTML completo (`index.html`, com gráficos e vídeos embutidos);
   - `videos-execucao`: vídeos `.mp4` de cada spec;
   - `screenshots-falhas`: screenshots, apenas quando houver falha.

Para visualizar o relatório, baixe o artefato `relatorio-mochawesome`, descompacte e abra `index.html`.

## Relatórios

O projeto usa o `cypress-mochawesome-reporter` (configurado em `cypress.config.js` e registrado em `cypress/support/e2e.js`).
A cada `cypress run` é gerado `cypress/reports/index.html` com:

- resumo (total, aprovados, reprovados, duração) e gráficos por spec;
- lista de testes com tempo de execução e passos (comandos Cypress);
- screenshots embutidos em caso de falha e vídeo de cada spec.

## Estrutura do projeto

```text
pgats-automacao-web-trabalho-final/
├── .github/workflows/cypress.yml      # Pipeline do GitHub Actions
├── cypress/
│   ├── e2e/                           # Specs (apenas orquestram os modulos; sem seletores ou assercoes)
│   │   ├── cadastro-e-login.cy.js     # TC 1, 2, 3, 4, 5
│   │   ├── produtos-e-busca.cy.js     # TC 8, 9
│   │   ├── assinatura.cy.js           # TC 10
│   │   └── pedidos.cy.js              # TC 15, 16
│   ├── fixtures/
│   │   └── dados-de-teste.json        # Dados estaticos (credenciais invalidas, termo de busca, comentario)
│   ├── modules/                       # Um modulo por funcionalidade (funcoes + module.exports)
│   │   ├── commons/index.js           # faker (gerarUsuario, gerarCartao), pagina inicial, API createAccount
│   │   ├── cadastro/index.js          # Signup, formulario de conta, exclusao de conta
│   │   ├── login/index.js             # Login, logout, mensagens de erro
│   │   ├── produtos/index.js          # Listagem, detalhe, busca, adicionar ao carrinho
│   │   ├── carrinho/index.js          # Pagina do carrinho e checkout
│   │   ├── checkout/index.js          # Endereco/resumo, comentario, pagamento, confirmacao
│   │   ├── assinatura/index.js        # Newsletter do rodape
│   │   └── fluxos/index.js            # Workflow/Facade: fluxos reutilizaveis (cadastro, login, carrinho, compra)
│   └── support/
│       ├── e2e.js                     # Reporter, tratamento de uncaught:exception
│       └── commands.js                # Sem comandos customizados (ver FUNCOES.md)
├── cypress.config.js                  # baseUrl, reporter, retries, viewport, video, timeouts
├── FUNCOES.md                         # Documentacao (docstring) de todas as funcoes dos modulos
├── package.json
└── README.md
```

## Padrões e boas práticas adotadas

- **Modularização por funcionalidade** (diretrizes de arquitetura da disciplina): cada módulo em `cypress/modules/<funcionalidade>/index.js`
  expõe funções em português com granularidade de ação de negócio (ex.: `preencherCadastro(usuario)`, não uma função por campo) via `module.exports`.
- **Seletores centralizados** na constante `seletores` de cada módulo, priorizando atributos estáveis (`data-qa`, `id`), depois `href`/texto; nenhum seletor nas specs.
- **Asserções apenas nos módulos** (funções `verificarSe...`); as specs leem como roteiro de negócio.
- **Padrão Workflow/Facade** (Aula 9) no módulo `fluxos`, para reaproveitar sequências comuns dos TC15/TC16 sem duplicar código.
- **Dados dinâmicos** com `@faker-js/faker` + `Date.now()` para garantir unicidade de e-mails na base pública compartilhada do site; dados estáticos em `cypress/fixtures`.
- **Preparação de massa via API** (`POST /api/createAccount`) para os cenários que exigem usuário pré-existente (TC2, TC4, TC5 e TC16), e **limpeza** (`Delete Account`) ao final, para não deixar lixo na base.
- **Isolamento**: `testIsolation: true`, `beforeEach` sempre parte da página inicial; cada `it` é independente.
- **Resiliência no CI**: `retries.runMode = 1` (apenas em `cypress run`), timeouts ajustados, `uncaught:exception` ignorado por causa dos anúncios de terceiros do site.
- **Evidências**: vídeo por spec, screenshot em falha e relatório HTML publicado como artefato do GitHub Actions.
- **Versionamento**: `.gitignore` exclui `node_modules`, vídeos, screenshots, relatórios e arquivos de ambiente.

## Decisões técnicas

- **TC9 (busca)**: a busca do site também considera a categoria (ex.: "Dress" retorna "Sleeves Top and Short", da categoria Women > Dress). A asserção exige que a lista não esteja vazia e que ao menos um resultado contenha o termo no nome, em vez de exigir isso de todos os itens.
- **TC15/TC16 (pedido)**: a tela de checkout usa `#cart_info table` (sem id na tabela), enquanto o carrinho usa `#cart_info_table`. A mensagem intermediária "Your order has been placed successfully!" desaparece quase imediatamente com o redirecionamento para `/payment_done`; a asserção final é feita no estado estável ("Order Placed!" / "Congratulations! Your order has been confirmed!").
- **Usuário fixo da suíte de login**: criado via API no `before()` com dados do faker e removido no `after()`, evitando dependência de uma conta compartilhada que pode ser apagada por outros alunos.
- **Browser no CI**: Electron (embutido no Cypress), que dispensa instalação adicional no runner e reduz o tempo de pipeline.
