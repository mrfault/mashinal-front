<template>
  <div class="pages-commercial-id">
    <div class="container">
      <breadcrumbs :crumbs="crumbs" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'pages-commercial-id',
  nuxtI18n: {
    paths: {
      az: '/ticari-avtomobiller/elan/:id'
    }
  },
  computed: {
    crumbs() {
      return [
        { name: this.$t('commercial'), route: '/commercial' },
        { name: this.$t('current_announcement') }
      ]
    }
  }
}
</script>