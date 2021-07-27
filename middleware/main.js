export default function ({ store, route }) {
  store.dispatch('setPageRef', { index: 0, path: store.getters.pageRefs[1] || '' });
  store.dispatch('setPageRef', { index: 1, path: route.path || '' });
  return true;
}

