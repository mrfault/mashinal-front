export const YMapsMixin = {
  methods: {
    ymapsScriptLoad(settings = {}) {
      return new Promise((resolve, reject) => {
        if (window.ymaps) return resolve();

        if (document.getElementById('yandex-maps-script')) {
          this.$nuxt.$on('ymaps-script-loaded', () => {
            resolve();
          });
          return;
        }

        const yandexMapScript = document.createElement('SCRIPT');

        const {
          apiKey = '606cbf2e-0ebb-48e4-b785-a39f959143ef',
          lang = 'az_AZ',
          version = '2.1',
          coordorder = 'latlong',
          debug = !!this.$env.DEV,
          enterprise = false,
        } = settings;

        const mode = debug ? 'debug' : 'release';
        const params = `lang=${lang}${apiKey && `&apikey=${apiKey}`}&mode=${mode}&coordorder=${coordorder}`;
        const link = `https://${enterprise ? 'enterprise.' : ''}api-maps.yandex.ru/${version}/?${params}`;

        yandexMapScript.setAttribute('src', link);
        yandexMapScript.setAttribute('async', '');
        yandexMapScript.setAttribute('defer', '');
        yandexMapScript.setAttribute('id', 'yandex-maps-script');

        document.head.appendChild(yandexMapScript);

        yandexMapScript.onload = () => {
          this.$nuxt.$emit('ymaps-script-loaded');
          resolve();
        };
        yandexMapScript.onerror = () => {
          reject();
        };
      });
    }
  }
}
