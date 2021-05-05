import _ from '~/lib/underscore';
import { generateMetaInfo } from '~/plugins/head-meta';

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
    
    return app.localePath(
      ('/ru'+(path === '/' ? '' : path)), 
      locale || app.i18n.locale
    );
  });
  inject('queryParams', (params) => {
    return '?' + Object.keys(params).map(key => `${key}=${params[key]}`).join('&');
  });
  // validators
  inject('isPhoneNumber', (value) => {
    return value.match(/^[+]994[ ][(][0-9]{2}[)][ ][0-9]{3}[-][0-9]{2}[-][0-9]{2}$/) !== null;
  });
  // formatting
  inject('parseUnsafe', (unsafe) => {
    if(unsafe == null) return '';
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  });
  inject('parseSlug', (str) => {
    return str.toLowerCase().replace(/ /g, '_');
  });
  inject('parseNumber', (str) => {
    return parseInt(`${str}`.replace(/ /g, ''));
  });
  inject('readNumber', (n, read = true) => {
    if (!read) return n;
    return (n || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  });  
  inject('readMoney', (n, currency, append = true) => {
    const value = this.readNumber(Math.round(parseFloat(n)));
    return `${append ? `${value} ${currency}`: `${currency} ${value}`}`;
  });
  inject('readPlural', (n, forms, count = true) => {
    return (count ? `${n} ` : '') + forms[(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2) ];
  });
  // helpers
  inject('paginate', (data) => {
    return data ? {
      current_page: data.current_page || 1,
      last_page: data.standard_count ? Math.ceil(data.standard_count / 40) : data.last_page,
      total: data.standard_count || data.total
    } : {}
  });
  inject('notUndefined', (...values) => {
    for(let i in values)
      if(values[i] !== undefined) return values[i];
    return values[0];
  });
  inject('translateHard', (name) => {
    if(!name) return name;
    let year = new Date().getFullYear();
    return name.toString()
      .replace('серия', app.i18n.t('series'))
      .replace('класс', app.i18n.t('class'))
      .replace(/( – 0)|( – н\.в\.)/g, name.toString().includes(`${year}`) ? '' : ` – ${year}`);
  });
  inject('search', (str, keyword) => {
    return str.toLowerCase().search(keyword.toLowerCase()) !== -1;
  });
  // underscore
  inject('clone', _.clone);
}