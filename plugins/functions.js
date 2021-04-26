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
  // validators
  inject('isPhoneNumber', (value) => {
    return value.match(/^[+]994[ ][(][0-9]{2}[)][ ][0-9]{3}[-][0-9]{2}[-][0-9]{2}$/) !== null;
  });
  // helpers
  inject('notUndefined', (...values) => {
    for(let i in values)
      if(values[i] !== undefined) return values[i];
    return values[0];
  });
  inject('readPlural', (n, forms, count = true) => {
    return (count ? `${n} ` : '') + forms[(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2) ];
  });
}