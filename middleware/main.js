export default function ({ app, route, redirect }) {
  if(!app.getRouteBaseName() && !route.fullPath.match(/^(\/ru\/)|^(\/ru$)/)) {
    redirect(app.$resolveRoute('/ru' + route.fullPath, app.i18n.locale || 'az'));
  }
  return true;
}

