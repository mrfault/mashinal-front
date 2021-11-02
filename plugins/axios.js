export default function ({ app, store, error, $axios }) {
  $axios.onRequest(config => {
    config.headers['locale'] = app.i18n.locale;
    config.headers['ptk'] = store.getters.ptk;
  });

  $axios.onResponse(res => {
    // handle sms radar errors
    if (res.data?.status === 'error' && res.data.error_code) {
      if ([3101].includes(res.data.error_code)) {
        return;
      } else if (process.client) {
        app.$toast.error(res.data.description);
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
    if (code === 404/* || code === 500*/) {
      error({statusCode:code});
      return true;
    } else if (code === 401) {
      if (!err.response.config.url.includes('user')) {
        window.location.reload();
      }
    } else if (![433].includes(code)) {
      if (process.client) {
        app.$toast.error(err.response.data.message);
      }
    }
  });
}