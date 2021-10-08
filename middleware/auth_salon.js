export default function ({ $auth, app, redirect }) {
  if (!$auth.loggedIn || !($auth.user.autosalon || $auth.user.part_salon)) {
    return redirect(app.$localePath('/'));
  }
}
