<template>
  <div class="pages-advanced-search">
    <div class="container"> 
      <cars-search-form 
        :assistant="true"
        :pending="pending"
        @pending="pending = true"
      />
    </div>
  </div>
</template>

<script>
import CarsSearchForm from '~/components/cars/CarsSearchForm';

export default {
  name: 'pages-cars-assistant',
  components: {
    CarsSearchForm
  },
  nuxtI18n: {
    paths: {
      az: '/masinlar/yardimci'
    }
  },
  head() {
    return this.$headMeta({
      title: this.$t('helper_search')
    });
  },
  computed: {
    crumbs() {
      return [
        { name: this.$t('helper_search') }
      ]
    }
  }
}
</script>