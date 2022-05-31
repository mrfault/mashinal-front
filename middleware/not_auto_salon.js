export default function (context) {
  let user = context.store.getters['user']

  if (user.autosalon!=null) {
    return context.redirect('/')
  }
}
