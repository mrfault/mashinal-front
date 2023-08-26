export default function ({app, store, error, $axios}) {
   $axios.onRequest(config => {

      config.headers['locale'] = app.i18n.locale;
      config.headers['breakpointm'] = ['xs', 'sm', 'md'].includes(store.getters.breakpoint);
      if (process.server && config.headers.common) {
         config.headers['breakpointm'] = config.headers.common['user-agent'].includes('Android') || config.headers.common['user-agent'].includes('iPhone')
      }
      config.headers['ptk'] = store.getters.ptk;
      if (app.$cookies.get('asan_token'))
         config.headers['asan-token'] = app.$cookies.get('asan_token');
   });

   $axios.onResponse(res => {
      // handle sms radar errors
      let smsRadarErrCode = res.data?.error_code;
      if (smsRadarErrCode) {
         if ([3101].includes(smsRadarErrCode)) {
            return;
         } else if (process.client) {
            app.$toast.error(app.i18n.t('garage_error_' + smsRadarErrCode));
         }
      }
   });

   $axios.onError(err => {
      // stop loading
      if (process.client) {
         app.store.dispatch('setLoading', false);
      }

      // handle global errors
      const code = parseInt(err.response && err.response.status);
      if (code === 402) return;
      if (code === 404/* || code === 500*/) {
         error({statusCode: code});
         return true;
      } else if (code === 401) {
         if (!err.response.config.url.includes('user')) {
            window.location.reload();
         }
      } else if (code === 422) {
         if(err.response.data && (err.response.data.message.includes("Aktiv elan sayı") || err.response.data.message.includes("Количество активных объявлений"))){
            app.$toast.error(err.response.data.message);
         }
         if (err.response.data.data) {
            Object.values(err.response.data.data).forEach((val) => {
               app.$toast.error(app.i18n.t(val[0]))
            })
         } else {
            app.$toast.error(app.i18n.t(err.message));
         }
      } else if (![433].includes(code)) {
         if (process.client) {
            app.$toast.error(app.i18n.t(err.response.data.message));
         }
      }
   });
}
