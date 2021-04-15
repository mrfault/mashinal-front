import { generateMetaInfo } from './head-meta';

export default function({ app, route, store }, inject) {
  // generate meta tags for seo
  inject('headMeta', ({ title, description, image }, product = false) => {
    description = description || app.i18n.t('meta-descr_main-page');
    let locale = app.i18n.locale;
    let path = app.i18n.locales
      .reduce((obj,l) => ({...obj, [l.code]: app.$localePath(route.fullPath, l.code)
      .split('?')[0].replace(/\/$/, '')}), {});
    return generateMetaInfo({title, description, image, path, locale, product });
  });
  // routing
  inject('localePath', (path, locale) => {
    path = '/ru'+(path === '/' ? '' : path);
    return app.localePath(path, locale || app.i18n.locale);
  });
  inject('queryParams', (params) => {
    return '?' + Object.keys(params).map(key => `${key}=${params[key]}`).join('&');
  });
}