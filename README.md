# PGAT - Automação de Testes Web

[![Testes E2E (Cypress)](https://github.com/analuizanasc/PGAT-automacoes-de-teste-web/actions/workflows/cypress.yml/badge.svg)](https://github.com/analuizanasc/PGAT-automacoes-de-teste-web/actions/workflows/cypress.yml)

Trabalho de conclusão da disciplina **Automação de Testes em Aplicações Web** da Pós-Graduação em Automação de Testes de Software (PGATS). Implementa, com Cypress, os casos **1, 2, 3, 4, 5, 8, 9, 10, 15 e 16** da página [Test Cases](https://automationexercise.com/test_cases) da aplicação fictícia [Automation Exercise](https://automationexercise.com).

**Relatório da última execução na `main`:** https://analuizanasc.github.io/PGAT-automacoes-de-teste-web/

## Tecnologias

| Ferramenta | Uso |
|---|---|
| [Cypress 13](https://www.cypress.io/) | Execução dos testes E2E |
| [cypress-mochawesome-reporter](https://www.npmjs.com/package/cypress-mochawesome-reporter) | Relatório HTML com gráficos e screenshot das falhas |
| [@faker-js/faker](https://fakerjs.dev/) | Massa de dados sintética e única por execução |
| GitHub Actions | Execução contínua, artifact do relatório e publicação no GitHub Pages |

## Como executar

Pré-requisito: Node.js 18 ou superior.

```bash
npm install
npm test            # headless no Chrome, gera cypress/reports/index.html
npm run cy:open     # modo interativo
```

## Mapa dos casos

| Caso | Título no site | Spec |
|---|---|---|
| TC1 | Register User | `cypress/e2e/cadastro.cy.js` |
| TC2 | Login User with correct email and password | `cypress/e2e/login.cy.js` |
| TC3 | Login User with incorrect email and password | `cypress/e2e/login.cy.js` |
| TC4 | Logout User | `cypress/e2e/login.cy.js` |
| TC5 | Register User with existing email | `cypress/e2e/cadastro.cy.js` |
| TC8 | Verify All Products and product detail page | `cypress/e2e/produtos.cy.js` |
| TC9 | Search Product | `cypress/e2e/produtos.cy.js` |
| TC10 | Verify Subscription in home page | `cypress/e2e/assinatura.cy.js` |
| TC15 | Place Order: Register before Checkout | `cypress/e2e/pedido.cy.js` |
| TC16 | Place Order: Login before Checkout | `cypress/e2e/pedido.cy.js` |

## Arquitetura

```
cypress/
├── e2e/                  specs por funcionalidade (asserções ficam aqui, visíveis no teste)
├── modules/              ações por funcionalidade, com os seletores privados de cada uma
│   ├── navegacao.js      home e menu do cabeçalho
│   ├── cadastro.js       signup e formulário de conta
│   ├── autenticacao.js   login
│   ├── catalogo.js       lista, busca, detalhe e adicionar ao carrinho
│   └── pedido.js         carrinho, checkout e pagamento
├── support/commands.js   setup e limpeza de massa via API (cy.criarUsuarioViaApi, cy.excluirUsuarioViaApi, cy.buscarProdutosViaApi)
├── fixtures/produtos.json  termo de busca, produto do carrinho e cartão de teste
└── utils/usuarioFactory.js usuário gerado com Faker, e-mail único por execução
```

A organização é por **funcionalidade**, e não por tela, para evitar um Page Object disfarçado: cada módulo representa um fluxo do usuário e guarda seus seletores numa constante privada. Os módulos usam funções ES6, sem classes nem herança.

## Decisões e boas práticas

- **Seletores:** `data-qa` sempre que a aplicação oferece; depois `id`; seletores por contexto só quando não há outra opção. Nenhum XPath absoluto.
- **URL base** em `cypress.config.js` e **hooks** (`beforeEach`) para os passos comuns de abrir a home.
- **Pré-condições via API:** quando o usuário só precisa existir (TC2, TC4, TC5, TC16), ele é criado com `cy.request` na API pública do site. A interface só é usada para cadastrar quando o cadastro é o objetivo do caso (TC1 e TC15).
- **Um objetivo por teste**, com asserções sobre o resultado esperado de cada caso: TC8 compara o nome do produto da lista com o da página de detalhe, e TC15/TC16 conferem o endereço de entrega contra os dados cadastrados.
- **Sem esperas fixas** (`cy.wait(ms)`), sem `{ force: true }`, sem `retries` e sem silenciar exceções da aplicação: se o teste falhar, a falha é real.
- **Anúncios de terceiros** bloqueados com `blockHosts`, porque cobrem botões e não fazem parte da aplicação em teste.

### Dois pontos que merecem explicação

- **TC9 (Search Product):** a busca do site devolve produtos cujo nome **ou categoria** contém o termo. Por exemplo, buscar "Top" traz "Little Girls Mr. Panda Shirt", que está na categoria "Tops & Shirts". Como a categoria não aparece no card, a [API de busca](https://automationexercise.com/api_list) serve de oráculo: o teste verifica que cada item retornado se relaciona ao termo e que a tela exibe exatamente esses itens.
- **TC15/TC16, mensagem "Your order has been placed successfully!":** a aplicação mostra essa mensagem no evento `submit` do pagamento e navega para `/payment_done` logo em seguida, então ela some antes do próximo comando do Cypress. O teste registra um listener de `submit` depois do listener da aplicação e lê o estado real da mensagem nesse instante. Depois confirma a página "Order Placed!".

## Integração contínua

O workflow [`.github/workflows/cypress.yml`](.github/workflows/cypress.yml) roda em push e pull request na `main` e também manualmente (`workflow_dispatch`):

1. executa a suíte headless no Chrome com `cypress-io/github-action`;
2. publica o relatório Mochawesome como artifact (`relatorio-mochawesome`), inclusive quando há falha;
3. publica os screenshots das falhas, quando houver;
4. publica o relatório no GitHub Pages na `main`.
