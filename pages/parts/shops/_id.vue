<template>
  <div class="pages-parts-shops-id">
    <div class="container">
      <breadcrumbs :crumbs="crumbs" />
      <salon-inner />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import SalonInner from '~/components/salons/SalonInner';

export default {
  name: 'pages-parts-shops-id',
  components: {
    SalonInner
  },
  nuxtI18n: {
    paths: {
      az: '/ehtiyat-hisseleri/magazalar/:id'
    }
  },
  head() {
    return this.$headMeta({
      title: `${ this.$t('shop') } "${this.salonSingle.name || this.salonSingle.user.full_name}" | ${this.$t('parts_shops')}`,
      description: this.salonSingle.short_description
    });
  },
  async asyncData({ store, route }) {
    await Promise.all([
      store.dispatch('getSalonById', {slug: route.params.id,page: (route.query.page || 1)}),
      store.dispatch('getMotoOptions'),
    ]);
  },
  computed: {
    ...mapGetters(['salonSingle']),

    crumbs() {
      return [
        { name: this.$t('parts'), route: '/parts' },
        { name: this.$t('shops'), route: '/parts/shops' },
        { name: this.salonSingle.name || this.salonSingle.user.full_name }
      ]
    }
  }
}
</script>
