<template>
  <div class="pages-comparison-index">
    <div class="container">
      <!-- Breadcrumb -->
      <breadcrumbs :crumbs="crumbs" />

      <!-- Filter -->
      <comparison-filter/>

      <!-- Main section -->
      <comparison-main-section />
      
      <!-- Add model -->
      <comparison-add-model />

    </div>
  </div>
</template>

<script>
import Breadcrumbs from '~/components/elements/Breadcrumbs'
import ComparisonFilter from '~/components/comparison/ComparisonFilter'
import ComparisonMainSection from '~/components/comparison/ComparisonMainSection'
import ComparisonAddModel from '~/components/comparison/ComparisonAddModel'

export default {
  name: 'comparison-index',
  components: {
    Breadcrumbs,
    ComparisonFilter,
    ComparisonMainSection,
    ComparisonAddModel
  },
  nuxtI18n: {
    paths: {
      az: '/muqayise'
    }
  },
  head() {
    return this.$headMeta({
      title: this.$t('meta-title_comparison'),
      description: this.$t('meta-descr_comparison'),
    });
  },
  async asyncData({ app, store }) {
    await store.dispatch('comparison/getInitialAnnouncements');
    const models = app.$cookies.get('comparisonModels');
    if (models?.length) {
      await Promise.all(
        models.map(id => store.dispatch('comparison/addModel', id))
      );
    }
  },  
  computed: {
    crumbs() {
      return [
        {
          name: this.$t('comparisons'),
          route: '/comparison'
        }
      ]
    }
  }
}
</script>