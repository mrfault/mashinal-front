export default function ({ $auth, app, route, redirect }) {
  if ($auth.loggedIn) {
    return redirect(app.$localePath(route.query.ref || '/'))
  }
}
