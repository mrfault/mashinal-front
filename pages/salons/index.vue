<template>
  <div class="pages-salons">
    <div class="container">
      <breadcrumbs :crumbs="crumbs" />
      <salon-search-form />
      <salon-filters-form />
      <div class="row mt-2 mt-lg-3 mb-n2 mb-lg-n3" v-if="salonsFiltered.length">
        <div class="col-lg-4 mb-2 mb-lg-3" v-for="salon in salonsFiltered" :key="salon.id">
          <nuxt-link class="keep-colors" :to="$localePath(`/salons/${salon.id}`)">
            <salon-card :salon="salon" />
          </nuxt-link>
        </div>
      </div>
      <no-results v-else />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

import SalonSearchForm from '~/components/salons/SalonSearchForm';
import SalonFiltersForm from '~/components/salons/SalonFiltersForm';
import SalonCard from '~/components/salons/SalonCard';
import NoResults from '~/components/elements/NoResults';

export default {
  name: 'pages-salons',
  components: {
    SalonSearchForm,
    SalonFiltersForm,
    SalonCard,
    NoResults
  },
  nuxtI18n: {
    paths: {
      az: '/salonlar'
    }
  },
  head() {
    return this.$headMeta({
      title: this.$t('car-showrooms'),
    });
  },
  async asyncData({ store, route }) {
    await Promise.all([
      store.dispatch('getBrands'),
      store.dispatch('getSalonsList'),
    ]);
    return {
    }
  },
  computed: {
    ...mapGetters(['salonsFiltered']),

    crumbs() {
      return [
        { name: this.$t('car-showrooms') }
      ]
    }
  },
  methods: {
    ...mapActions([]),

  }
}
</script>