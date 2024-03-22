// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
    devtools: {
        enabled: true,
        timeline: {
            enabled: true
        }
    },
    css: [
        "~/assets/css/main.css",
        "primevue/resources/themes/aura-dark-green/theme.css"
    ],
    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {}
        }
    },
    modules: ["nuxt-primevue"],
    app: {
        head: {
            charset: "utf-8",
            viewport: "width=device-width, initial-scale=1"
        }
    },
    runtimeConfig: {
        dataDir: '',
    },
});
