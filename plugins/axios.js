export default function ({ app, error, $axios }) {
  $axios.onRequest(config => {
    config.headers['locale'] = app.i18n.locale;
  });

  $axios.onError(err => {
    // console.log(err.response.data.message);
    // console.log(err.response.data.exception);
    // console.log(err.response.data.file);
    // console.log(err.response.data.line);
    
    if (process.client) {
      app.store.dispatch('toggleLoading', false);
    }

    const code = parseInt(err.response && err.response.status);
    
    if (code === 404/* || code === 500*/) {
      error({statusCode:code});
      return true;
    } else if (code === 401) {
      if (!err.response.config.url.includes('user')) {
        location.reload();
      }
    } else {
      if (process.client) {
        app.$toast.error(err.response.data.message);
      }
    }
  });
}