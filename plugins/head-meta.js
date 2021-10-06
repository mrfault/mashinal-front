export const generateMetaInfo = ({ title, description, image, path, locale, product }) => {
  const getPath = (lang) => 'https://mashin.al' + path[lang];
  image = image || 'https://mashin.al/mashinal-banner.png';
  
  let services = [], types = [];
  if (product) {
    services = Object.keys(product.services || {}).map(key => ({ 1: 'VIP', 2: 'Premium', 4: 'Top'})[key]);
    if (product.barter) types.push('Barter');
    if (product.credit) types.push('Kredit');
  }

  product = (!product || locale !== 'az') ? [] : [
    { hid: 'product:locale', property: 'product:locale', content: product.locale || locale },
    { hid: 'product:category', property: 'product:category', content: product.category },
    { hid: 'product:brand', property: 'product:brand', content: product.brand },
    { hid: 'product:custom_label_0', property: 'product:custom_label_0', content: product.autosalon ? product.autosalon.name : 'Users' },
    { hid: 'product:custom_label_1', property: 'product:custom_label_1', content: product.model },
    { hid: 'product:custom_label_2', property: 'product:custom_label_2', content: product.year },
    { hid: 'product:custom_label_3', property: 'product:custom_label_3', content: (services.length ? services.join(' ') : 'Free') + (product.autosalon ? ' Salon' : '') },
    { hid: 'product:retailer_item_id', property: 'product:retailer_item_id', content: product.id },
    { hid: 'product:price:amount', property: 'product:price:amount', content: product.price.amount },
    { hid: 'product:price:currency', property: 'product:price:currency', content: product.price.currency === 1 ? 'AZN' : 'USD' },
    { hid: 'product:condition', property: 'product:condition', content: product.new ? 'new' : 'used' },
    { hid: 'product:availability', property: 'product:availability', content: product.available ? 'in stock' : 'out of stock' },
    { hid: 'product_type', property: 'product_type', content: types.join(' ') },
  ]

  return { 
    titleTemplate: getPath('az') === '/' ? '%s' : '%s | Mashin.AL',
    htmlAttrs: {
      lang: locale
    },
    title: title,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, user-scalable=no' },
      { hid: 'author', name: 'author', content: 'AlVentures' },
      { hid: 'theme-color', name: 'theme-color', content: '#f2f2f2' },
      { hid: 'application-name', name: 'application-name', content: 'Mashin.AL' },
      { hid: 'msapplication-TileColor', name: 'msapplication-TileColor', content: '#b91d47' },
      { hid: 'description', name: 'description', content: description },
      // twitter card
      { hid: 'twitter:card', name: 'twitter:card', content: 'summary' },
      { hid: 'twitter:site', name: 'twitter:site', content: 'Mashin.AL' },
      { hid: 'twitter:title', name: 'twitter:title', content: title },
      { hid: 'twitter:description', name: 'twitter:description', content: description },
      { hid: 'twitter:image', name: 'twitter:image', content: image },
      { hid: 'twitter:url', name: 'twitter:url', content: getPath(locale) },
      // open graph
      { hid: 'og:site_name', property: 'og:site_name', content: 'Mashin.AL' },
      { hid: 'og:type', property: 'og:type', content: 'website' },
      { hid: 'og:title', property: 'og:title', content: title },
      { hid: 'og:description', property: 'og:description', content: description },
      { hid: 'og:image', property: 'og:image', content: image },
      { hid: 'og:url', property: 'og:url', content: getPath(locale) },
      { hid: 'og:locale', property: 'og:locale', content: locale },
      ...product
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
      { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
      { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
      { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#f2f2f2' },
      { rel: 'manifest', href: '/site.webmanifest' },
      { hid: 'canonical-lang-' + locale, rel: 'canonical', href: getPath(locale) },
      { hid: 'alternate-lang-az', rel: 'alternate', hreflang: 'x-default', href: getPath('az') },
      { hid: 'alternate-lang-ru', rel: 'alternate', hreflang: 'ru', href: getPath('ru') }
    ]
  }
}