const config = {
  isDev: true,
  isProd: true,
  useBaseUrl: true
}

export default {
  target: 'server',
  
  terser: {
    sourceMap: true
  },

  telemetry: false,

  cli: {
    badgeMessages: ['Mashin.al'],
  },

  loading: '~/components/elements/LoadingIndicator',
  
  router: {
    linkActiveClass: 'active',
    linkExactActiveClass: 'exact-active',
  },

  css: [
    '~/assets/scss/style.scss'
  ],

  plugins: [
    { src: '~/mixins/vue-global' },
    { src: '~/plugins/components' },
    { src: '~/plugins/functions' },
    { src: '~/plugins/axios' },
    { src: '~/plugins/both-sides' },
    { src: '~/plugins/client-only', ssr: false }
  ],

  components: false,

  modules: [
    'bootstrap-vue/nuxt',
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
    '@nuxtjs/toast',
    'nuxt-i18n',
    'cookie-universal-nuxt',
    'portal-vue/nuxt',
    ['nuxt-env', {
      keys: [
        {key: 'DEV', default: config.isDev },
        {key: 'BASE_URL', default: config.useBaseUrl ? (config.isProd ? 'https://mashin.al' : 'https://dev.mashin.al') : ''},
        {key: 'API_BASE_URL', default: config.isProd ? 'https://mashin.al/api' : 'https://dev.mashin.al/api'},
        {key: 'WEBSITE_URL', default: config.isProd ? 'https://mashin.al' : 'https://dev.mashin.al'},
        {key: 'WS_HOST', default: config.isProd ? 'mashin.al' : 'dev.mashin.al'},
        {key: 'BROADCAST_URL', default: config.isProd ? 'https://mashin.al/broadcasting/auth' : 'https://dev.mashin.al/broadcasting/auth'},
        {key: 'YANDEX_MAPS_API', default: '606cbf2e-0ebb-48e4-b785-a39f959143ef'},
        {key: 'YANDEX_STATIC_MAPS_API', default: 'dd74bc7c-fb4c-4260-9f70-086ce90ef79d'},
        {key: 'YANDEX_GEOCODING_API', default: 'f90c2034-652c-4117-b195-a88245d91823'}
      ]
    }],
  ],

  buildModules: [
  ],

  axios: {
    baseURL: config.isProd ? 'https://mashin.al/api' : 'https://dev.mashin.al/api'
  },

  toast: {
    position: 'top-right',
    fullWidth: false,
    duration: 3000,
    singleton: false
  },
  
  auth: {
    redirect: false,
    strategies: {
      local: {
        url: '/',
        endpoints: {
          login: {
            url: '/login'
          },
          logout: {
            url: '/logout'
          },
          user: {
            url: '/user'
          }
        },
        user: {
          property: 'user',
          // autoFetch: true
        },
        token: {
          property: 'meta.token',
          maxAge: 15768000
        }
      },
    }
  },
  
  i18n: {
    seo: false,
    lazy: true,
    locales: [
      {
        code: 'ru',
        file: 'ru.js',
        iso: 'ru-ru'
      },
      {
        code: 'az',
        file: 'az.js',
        iso: 'az-az'
      }
    ],
    langDir: 'locales/',
    strategy: 'prefix_except_default',
    defaultLocale: 'az',
    baseUrl: 'https://mashin.al',
    vueI18n: {
      fallbackLocale: 'ru',
      silentTranslationWarn: true,
      silentFallbackWarn: true,
    },
    detectBrowserLanguage: false
  },

  server: {
    port: 3000,
    host: '0.0.0.0'
  },

  render: {
    bundleRenderer: {
      shouldPreload: (file, type) => {
        if (type === 'script' || type === 'style') {
          return true
        }
        if (type === 'font') {
          // only preload woff2 fonts
          return /\.woff2$/.test(file)
        }
      }
    }
  },

  bootstrapVue: {
    bootstrapCSS: false,
    bootstrapVueCSS: false,
    componentPlugins: [
      // 'LayoutPlugin',
      // 'FormPlugin',
      // 'FormGroupPlugin',
      // 'FormInputPlugin',
      // 'FormSelectPlugin',
      // 'FormTextareaPlugin',
      // 'FormCheckboxPlugin',
      // 'FormRadioPlugin',
      // 'DropdownPlugin',
      // 'ButtonPlugin',
      // 'ModalPlugin',
      // 'BreadcrumbPlugin',
      // 'CollapsePlugin'
    ]
  },

  build: {
  }
}
