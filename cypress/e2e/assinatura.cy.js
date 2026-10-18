/// <reference types="cypress" />

// Trabalho Final - Caso de teste 10 de https://www.automationexercise.com/test_cases
//   TC10 - Verify Subscription in home page

const commons = require('../modules/commons')
const assinatura = require('../modules/assinatura')

describe('Automation Exercise - Assinatura da newsletter (TC 10)', () => {
  beforeEach(() => {
    commons.acessarPaginaInicial()
  })

  it('Test Case 10: Verificar assinatura na página inicial', () => {
    // E-mail ficticio e unico por execucao (a assinatura nao e usada de fato).
    const email = `assinatura.pgats.${Date.now()}@mail.com`

    assinatura.rolarAteAssinaturaNoRodape()
    assinatura.assinarNewsletter(email)
    assinatura.verificarSeAssinaturaFoiEfetuadaComSucesso()
  })
})
