// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  runtimeConfig: {
    dbUrl: process.env.DB_URL || "file:./data/fleetorganizer.db",
    sessionSecret: process.env.SESSION_SECRET || "change-me",
  },
})
