<template>
  <div class="pages-sell">
    <div class="container">
      <breadcrumbs :crumbs="crumbs" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'pages-sell-commercial',
  nuxtI18n: {
    paths: {
      az: '/satmaq/ticari-avtomobiller'
    }
  },
  computed: {
    ...mapGetters(['sellForm']),

    crumbs() {
      return [
        { name: this.$t('place_an_ad'), route: '/sell' },
        { name: this.$t('commercial') }
      ]
    }
  }
}
</script>