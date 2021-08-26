export default function ({ $auth, app, redirect }) {
  if ($auth.user.autosalon) {
    return redirect(app.$localePath('/profile/dashboard'));
  } else if ($auth.user.user_type !== 0) {
    return redirect(app.$localePath('/'));
  }
}