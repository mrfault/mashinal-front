<template>
  <div class="pages-salons">
    <div class="container">
      <breadcrumbs :crumbs="crumbs" />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'pages-salons',
  components: {
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

    return {
    }
  },
  computed: {
    ...mapGetters([]),

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