export default function ({ app, store, error, $axios }) {
  $axios.onRequest(config => {
    config.headers['locale'] = app.i18n.locale;
    config.headers['ptk'] = store.getters.ptk;
  });

  $axios.onError(err => {
    // console.log(err.response.data.message);
    // console.log(err.response.data.exception);
    // console.log(err.response.data.file);
    // console.log(err.response.data.line);
    
    if (process.client) {
      app.store.dispatch('setLoading', false);
    }

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