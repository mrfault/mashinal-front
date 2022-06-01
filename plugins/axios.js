export default function ({ app, store, error, $axios }) {
  $axios.onRequest(config => {
    config.headers['locale'] = app.i18n.locale;
    config.headers['ptk'] = store.getters.ptk;
    if(app.$cookies.get('asan_token'))
      config.headers['asan-token'] = app.$cookies.get('asan_token');
  });

  $axios.onResponse(res => {
    // handle sms radar errors
    let smsRadarErrCode = res.data?.error_code;
    if (smsRadarErrCode) {
      if ([3101].includes(smsRadarErrCode)) {
        return;
      } else if (process.client) {
        app.$toast.error(app.i18n.t('garage_error_'+smsRadarErrCode));
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
    if(code === 402) return;
    if (code === 404/* || code === 500*/) {
      error({statusCode:code});
      return true;
    } else if (code === 401) {
      if (!err.response.config.url.includes('user')) {
        window.location.reload();
      }
    } else if (![433].includes(code)) {
      if (process.client) {
        app.$toast.error(app.i18n.t(err.response.data.message));
      }
    }
  });
}
