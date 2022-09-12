export default function ({ $auth, app, redirect,route }) {
  let resolve = app.router.resolve({name: route.name.replace('___az','___ru')});

  if (!$auth.loggedIn) {
    return redirect(app.$localePath(`/login?ref=${resolve?.route?.path?.replace('/ru','')}`))
  }
}
