export default function ({ app, route, redirect, error }) {
  let devRoutes = [];
  let routeName = app.getRouteBaseName();
  
  if (devRoutes.includes(routeName) && !app.$env.DEV) {
    return error({ statusCode: 404 });
  }
  
  if(!routeName && !route.fullPath.match(/^(\/ru\/)|^(\/ru$)/)) {
    let path = app.$resolveRoute('/ru' + route.fullPath, app.i18n.locale || 'az');
    if (path !== '/') return redirect(path);
  }
  return true;
}

