export default function ({ route, app, redirect }) {
  if (!route.query) 
    return true;
  let path;
  let page = route.query.page;
  let announcement = route.query.announcement;
  let status = route.query.success;
  if (announcement) {
    path = app.$localePath(`/${page}/announcement/${announcement}`);
  } else if (page) {
    path = app.$localePath(page);
  }
  if (path && ['true','false'].includes(status)) {
    redirect(`${path}?success=${status}`);
  }
  return true;
}