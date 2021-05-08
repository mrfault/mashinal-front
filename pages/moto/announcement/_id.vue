<template>
  <div class="pages-moto-id">
    <div class="container">
      <breadcrumbs :crumbs="crumbs" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'pages-moto-id',
  nuxtI18n: {
    paths: {
      az: '/moto/elan/:id'
    }
  },
  computed: {
    crumbs() {
      return [
        { name: this.$t('moto'), route: '/moto' },
        { name: this.$t('current_announcement') }
      ]
    }
  }
}
</script>