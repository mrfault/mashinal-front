import _ from '~/lib/underscore';
import moment from 'moment';
import { generateMetaInfo } from '~/plugins/head-meta';

import 'moment/locale/ru';
import 'moment/locale/az';

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
    if (!path) return '#0';
    // check if route name was specified and escape trailing slash
    if (!path.includes('/')) return app.localePath(path).replace(/\/+$/, '');
    // do some magic
    if (path === '/')  
      return '/' + (app.i18n.locale === 'az' ? '' : app.i18n.locale);
    else 
      path = app.localePath(('/ru'+(path === '/' ? '' : path)), locale || app.i18n.locale);
    // check if the right locale in path
    if (path.includes('/ru/') && app.i18n.locale !== 'ru') 
      path = path.replace('/ru/', '/');
    // escape trailing slash
    return path.replace(/\/+$/, '');
  });
  inject('resolveRoute', (path, locale) => {
    let route = app.router.resolve(path).route;
    let name = app.getRouteBaseName(route);
    let params = route.params;
    let query = route.query;
    
    locale = locale || app.i18n.locale;
    return app.localePath({name, params, query}, locale);
  });
  inject('queryParams', (params, skipEmpty) => {
    let keys = Object.keys(params).filter(key => skipEmpty ? ![undefined, '', false].includes(params[key]) : true);
    return '?' + keys.map(key => `${key}=${encodeURIComponent(params[key])}`).join('&');
  });
  inject('removeQueryParam', (param) => {
    let query = _.clone(route.query);
    delete query[param];
    app.router.push({ query });
  });
  inject('pushQueryParam', (param) => {
    let query = _.clone(route.query);
    app.router.push({ query: {...query, [param.key]: param.value } });
  });
  // formatting
  inject('parsePhone', (phone, brief = false) => {
    if (typeof phone === 'number') phone = `${phone}`;
    if (!phone || phone.length !== 12) return '';
    return ('994'+phone.slice(3))
      .replace(/(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})/g, brief ? '($2) $3-$4-$5' : '+$1 ($2) $3-$4-$5');
  });
  inject('parseUnsafe', (unsafe) => {
    if (unsafe == null) return '';
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
    return `${count ? `${n} ` : ''}${forms[(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2) ]}`;
  });
  // masks
  inject('maskPhone', (inline = false) => {
    let mask = '+\\9\\94 (99) 999-99-99';
    return inline ? mask : { mask, showMaskOnHover: false };
  });
  inject('maskEmail', () => {
    return {
      alias: 'email',
      showMaskOnHover: false, 
      showMaskOnFocus: false
    }
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
      if (values[i] !== undefined) return values[i];
    return values[0];
  });
  inject('translateHard', (name) => {
    if (!name) return name;
    name = name[app.i18n.locale] || name.ru || name;
    let year = new Date().getFullYear();
    return name.toString()
      .replace('series', app.i18n.t('series'))
      // .replace('class', app.i18n.t('class'))
      .replace(/( – 0)|( – н\.в\.)/g, name.toString().includes(`${year}`) ? '' : ` – ${year}`);
  });
  inject('translateSoft', (name) => {
    return name[app.i18n.locale] || name.ru || name || '';
  });
  inject('search', (str, keyword) => {
    return str && str.toString().toLowerCase().search(keyword.toLowerCase()) !== -1;
  });
  inject('expireDate', (days = 30) => {
    return new Date(new Date().getTime() + (days * 24 * 3600 * 1000));
  });
  inject('maxInArray', (array) => {
    if (array.length === 0) return null;
    if (array.length === 1) return array[0];
    let k = array[0];
    for (let i = 1; i < array.length; i++) {
      k = Math.max(array[i], k);    
    }
    return k;
  });
  inject('skipUndefinedEntries', (o) => {
    return Object.entries(o).reduce((a,[k,v]) => (v == null || v === '' || v === false ? a : (a[k]=v, a)), {});
  });
  inject('withBaseUrl', (url, dir = '') => {
    if (!url) return url;
    return (url.includes('https://') || url.includes('http://')) ? url : `${app.$env.BASE_URL}${dir}${url}`;
  });
  inject('formatDate', (date, format = 'DD.MM.YYYY', weekdays, parse) => {
    const fixDayOfWeek = (n) => n == 0 ? 6 : n - 1;
    if (parse)
      date = Date.parse(date);
    if (weekdays)
      format = format.replace('day', weekdays[fixDayOfWeek(moment(date).format('d'))]);
    moment.locale('ru');
    let ru = moment(date).format(format);
    moment.locale('az');
    let az = moment(date).format(format);
    moment.locale('en');
    let en = moment(date).format(format);
    return ({ ru, az, en });
  });
  // underscore
  inject('clone', _.clone);
  inject('sortBy', _.sortBy);
  inject('chunk', _.chunk);
  // inject('uniq', _.uniq);
  // inject('groupBy', _.groupBy);
  inject('moment', moment);
}