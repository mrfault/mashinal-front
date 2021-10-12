export default function ({ route, app, redirect, store }) {
  if (!route.query) 
    return true;
  let path;
  let page = route.query.page;
  let announcement = route.query.announcement;
  let id = route.query.id;
  let status = route.query.success;
  let query = '';
  if (announcement) {
    path = app.$localePath(`/${page}/announcement/${announcement}`);
  } else if (id) {
    if (page === 'business-profile') {
      query += ('&type='+id);
      path = app.$localePath(page);
    } else if (page === 'dashboard') {
      path = app.$localePath(`/dashboard/${id}`);
    } else if (page === 'dashboard-settings') {
      path = app.$localePath(`/dashboard/${id}/settings`);
    }
  } else if (page) {
    path = app.$localePath(page);
  }
  if (path && ['true','false'].includes(status)) {
    return redirect(`${path}?success=${status}${query}`);
  }
  return true;
}