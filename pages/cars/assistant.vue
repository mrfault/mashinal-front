<template>
  <div class="pages-cars-assistant">
    <div class="container"> 
      <breadcrumbs :crumbs="crumbs" />
      <car-search-form 
        :assistant="true"
        :pending="pending"
        @pending="pending = true"
      />
    </div>
  </div>
</template>

<script>
import CarSearchForm from '~/components/cars/CarSearchForm';

export default {
  name: 'pages-cars-assistant',
  layout: 'search',
  components: {
    CarSearchForm
  },
  nuxtI18n: {
    paths: {
      az: '/masinlar/beledci'
    }
  },
  head() {
    return this.$headMeta({
      title: this.$t('helper_search')
    });
  },
  async asyncData({ store }) {
    await Promise.all([
      store.dispatch('getBodyOptions'),
      store.dispatch('getOptions'),
      store.dispatch('getAllOtherOptions', '2'),
    ]);

    return {
      pending: false
    }
  },
  computed: {
    crumbs() {
      return [
        { name: this.$t('cars'), route: '/cars' },
        { name: this.$t('helper_search') }
      ]
    }
  }
}
</script>