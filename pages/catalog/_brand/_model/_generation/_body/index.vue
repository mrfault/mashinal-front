<template>
  <div></div>
</template>

<script>
export default {
  async asyncData({ store, route }) {
    let { page, filter } = route.query;
    let post = JSON.parse(filter || '{}');
    await Promise.all([
       // store.dispatch('getGenerationTypes', route.params),
       store.dispatch('getBodyModification', route.params),
       store.dispatch('getModificationsList', route.params),
      // store.dispatch('getGenerationTypes', route.params),
      store.dispatch('getCatalogSearch', { post, page, params: {...route.params} })
    ]);
  }
}
</script>
