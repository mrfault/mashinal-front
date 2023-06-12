<template>
  <div></div>
</template>

<script>
export default {
  async asyncData({ store, route }) {
    let { page, filter } = route.query;
    let post = JSON.parse(filter || '{}');
    await Promise.all([
      store.dispatch('getBrands'),
      store.dispatch('getBodyOptions'),
      store.dispatch('getModels', route.params.brand),
      store.dispatch('getGenerations', route.params),
      // store.dispatch('getGenerationTypes', route.params),
      store.dispatch('getFirstGeneration', route.params),
      store.dispatch('getCatalogSearch', { post, page, params: {...route.params} })
    ]);
  }
}
</script>
