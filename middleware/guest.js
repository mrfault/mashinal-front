export default function ({ $auth, app, redirect }) {
  if ($auth.loggedIn) {
    return redirect(app.$localePath('/'))
  }
}
