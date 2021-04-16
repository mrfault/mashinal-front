export default function ({ $auth, app, redirect }) {
  if (!$auth.loggedIn || !$auth.user.autosalon) {
    return redirect(app.$localePath('/'));
  }
}
