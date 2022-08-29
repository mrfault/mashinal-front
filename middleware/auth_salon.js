export default function ({ $auth, app, redirect, route, error }) {
  if (!['1','2','3'].includes(route.params.type) || (route.params.type == 1 && !$auth.user.autosalon) || (route.params.type == 2 && !$auth.user.part_salon)) {
    return error({ statusCode: 404 });
  }
  if (!$auth.loggedIn || !($auth.user.autosalon || $auth.user.part_salon)) {
    return redirect(app.$localePath('/'));
  }
}
