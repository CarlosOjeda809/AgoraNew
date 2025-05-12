export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_KEY,
      guardianApiKey: process.env.GUARDIAN_API_KEY,
      BASE_URL: process.env.BASE_URL 
    }
  },
  supabase: {
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      include: undefined,
      exclude: ['/register', '/callback'], 
      saveRedirectToCookie: false
    }
  },
  compatibilityDate: '2024-11-01', 
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@nuxt/icon', '@nuxt/image', '@nuxtjs/supabase'],
  css: ['~/assets/css/main.css']
})