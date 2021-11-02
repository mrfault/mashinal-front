<template>
  <div class="pages-garage-index pt-5">
    <div class="container">
      <breadcrumbs :crumbs="crumbs" />
      <template v-if="cars.data">
        <garage-nav :tab="tab" @change-tab="tab = $event" />
        <cars-list v-if="tab === 'cars'" />
      </template>
      <template v-else>
        <garage-empty />
      </template>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import GarageNav from '~/components/garage/GarageNav';
import GarageEmpty from '~/components/garage/GarageEmpty';
import CarsList from '~/components/garage/CarsList';

export default {
  name: 'pages-garage-index',
  components: {
    GarageNav,
    GarageEmpty,
    CarsList
  },
  middleware: ['auth_general'],
  nuxtI18n: {
    paths: {
      az: '/qaraj'
    }
  },
  head() {
    return this.$headMeta({
      title: this.$t('garage')
    });
  },
  async asyncData({ store, $auth }) {
    await Promise.all([
      store.dispatch('garage/getCarList', { phone: $auth.user.phone })
    ]);
    return {
      tab: 'cars'
    }
  },
  computed: {
    ...mapGetters({
      cars: 'garage/cars'
    }),

    crumbs() {
      return [
        { name: this.$t('garage') }
      ]
    }
  },
  methods: {
    
  }
}
</script>