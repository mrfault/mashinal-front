<template>
  <div></div>
</template>

<script>
export default {
  async asyncData({ store, route }) {
    let { page, filter } = route.query;
    let post = JSON.parse(filter || '{}');
    await Promise.all([
       store.dispatch('getGenerations', route.params),
      store.dispatch('getCatalogSearch', { post, page, params: {...route.params} })
    ]);
  }
}
</script>
