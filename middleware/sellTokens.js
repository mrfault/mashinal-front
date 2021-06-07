export default function ({ app, $auth, store, redirect }) {
  if((!$auth.loggedIn && store.state.sellTokens <= 0) || ($auth.loggedIn && $auth.user.announce_left <= 0)) {
    redirect(app.$localePath('/sell'));
  }
  return true;
}