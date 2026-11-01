const { defineConfig } = require('cypress')

module.exports = defineConfig({
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir: 'cypress/reports',
    reportPageTitle: 'Automation Exercise - Relatório de Testes',
    charts: true,
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: false,
  },
  e2e: {
    baseUrl: 'https://automationexercise.com',
    // Anúncios de terceiros cobrem botões e disparam vinhetas; não fazem parte da aplicação em teste
    blockHosts: [
      '*googlesyndication.com',
      '*doubleclick.net',
      '*googleadservices.com',
      '*google-analytics.com',
      '*googletagmanager.com',
      '*adservice.google.com',
      '*fundingchoicesmessages.google.com',
    ],
    viewportWidth: 1366,
    viewportHeight: 768,
    video: false,
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on)
      return config
    },
  },
})
