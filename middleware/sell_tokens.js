export default function ({ app, $auth, store, redirect }) {
  let tokens = {
    cars: 0,
    moto: 0,
    commercial: 0,
    parts: 0
  }

  for (let type in tokens) {
    let tokenKey = `announce_left_${type}`;
    if (type === 'cars') tokenKey = tokenKey.slice(0, -1);
    else if (type === 'parts') tokenKey = 'part_announce_left';
    if ($auth.loggedIn) tokens[type] = $auth.user[tokenKey];
    else if (store.state.sellTokens) tokens[type] = store.state.sellTokens[type];

    if (app.getRouteBaseName() === `sell-${type}` && tokens[type] <= 0) {
      return redirect(app.$localePath('/sell'));
    } 
  };

  return true;
}