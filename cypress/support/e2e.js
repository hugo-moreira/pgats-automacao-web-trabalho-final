// Arquivo de suporte carregado antes de cada spec.

// Registro do relatorio HTML (cypress-mochawesome-reporter)
require('cypress-mochawesome-reporter/register')

// Comandos customizados (nenhum definido: a modularizacao e feita em cypress/modules)
require('./commands')

// A aplicacao Automation Exercise carrega anuncios de terceiros que disparam
// excecoes JavaScript nao tratadas e que nao fazem parte do que esta sendo testado.
// Ignoramos essas excecoes para que nao interrompam a execucao dos testes.
Cypress.on('uncaught:exception', () => false)
