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
import Breadcrumbs from '~/components/elements/Breadcrumbs.vue'
import ComparisonFilter from '~/components/comparison/ComparisonFilter.vue'
import ComparisonMainSection from '~/components/comparison/ComparisonMainSection.vue'
import ComparisonAddModel from '~/components/comparison/ComparisonAddModel.vue'

export default {
  name: 'comparison-index',
  layout: 'default',
  nuxtI18n: {
    paths: {
      az: '/muqayise'
    }
  },
  head() {
    // TODO Correct translations [az/ru]
    return this.$headMeta({
      title: this.$t('meta-title_comparison'),
      description: this.$t('meta-descr_comparison'),
    })
  },
  components: {
    Breadcrumbs,
    ComparisonFilter,
    ComparisonMainSection,
    ComparisonAddModel
  },
  async asyncData() {
    //
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

<style>

</style>