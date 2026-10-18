const { defineConfig } = require('cypress')

module.exports = defineConfig({
  // Relatorio HTML (Aula 7): cypress-mochawesome-reporter
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir: 'cypress/reports',
    reportFilename: 'index',
    reportPageTitle: 'PGATS3 - Trabalho Final - Automation Exercise',
    reportTitle: 'Automation Exercise - Casos de Teste 1, 2, 3, 4, 5, 8, 9, 10, 15 e 16',
    charts: true,
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: false,
    overwrite: true,
    html: true,
    json: true,
  },

  e2e: {
    baseUrl: 'https://www.automationexercise.com',
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: 'cypress/support/e2e.js',

    // Configuracoes avancadas (Aula 8)
    viewportWidth: 1366,
    viewportHeight: 768,
    watchForFileChanges: false,
    testIsolation: true,
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 60000,
    requestTimeout: 15000,
    responseTimeout: 30000,

    // Nova tentativa apenas no modo run (CI); localmente falha de imediato
    retries: {
      runMode: 1,
      openMode: 0,
    },

    // Evidencias
    video: true,
    videoCompression: 32,
    screenshotOnRunFailure: true,
    screenshotsFolder: 'cypress/screenshots',
    videosFolder: 'cypress/videos',

    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on)
      return config
    },
  },
})
