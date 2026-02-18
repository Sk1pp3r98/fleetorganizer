import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  css: ['./app/assets/css/main.css'],

  runtimeConfig: {
    dbUrl: process.env.DB_URL || "file:./data/fleetorganizer.db",
    sessionSecret: process.env.SESSION_SECRET || "change-me",
  },

  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],

  modules: [
    ['@nuxtjs/google-fonts', {
        families: {
          Orbitron: true,
        }
    }],
  ],
})