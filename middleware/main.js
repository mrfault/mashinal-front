export default function ({ app, route, redirect }) {
  if(!app.getRouteBaseName() && !route.fullPath.match(/^(\/ru\/)|^(\/ru$)/)) {
    let path = app.$resolveRoute('/ru' + route.fullPath, app.i18n.locale || 'az');
    if (path !== '/') return redirect(path);
  }
  return true;
}

