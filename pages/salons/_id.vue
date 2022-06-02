<template>
  <div class="pages-salons-id">
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
  name: 'pages-salons-id',
  components: {
    SalonInner
  },
  nuxtI18n: {
    paths: {
      az: '/salon/:id'
    }
  },
  head() {
    return this.$headMeta({
      title: `${this.$t('autosalon')} "${this.salonSingle.name || this.salonSingle.user.full_name}" | ${this.$t('salons')}`,
      description: this.salonSingle.short_description
    });
  },
  async asyncData({ store, route }) {
    await Promise.all([
      store.dispatch('getSalonById', {slug: route.params.id}),
      store.dispatch('getMotoOptions'),
    ]);

  },
  mounted() {
    this.$store.commit('mutate',{
      property: 'announcement',
      value: {}
    })
  },
  computed: {
    ...mapGetters(['salonSingle']),

    crumbs() {
      return [
        { name: this.$t('salons'), route: '/salons' },
        { name: this.salonSingle.name || this.salonSingle.user.full_name }
      ]
    }
  }
}
</script>
