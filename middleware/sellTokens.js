export default function ({ app, $auth, store, redirect }) {
  let sellParts = app.getRouteBaseName() === 'sell-parts';
  let hasTransportTokens = !$auth.loggedIn ? store.state.sellTokens?.transport > 0 : $auth.user.announce_left > 0;
  let hasPartsTokens = !$auth.loggedIn ? store.state.sellTokens?.parts > 0 : $auth.user.part_announce_left > 0;
  if ((!sellParts && !hasTransportTokens) || (sellParts && !hasPartsTokens) || (!hasTransportTokens && !hasPartsTokens)) {
    redirect(app.$localePath('/sell'));
  }
  return true;
}