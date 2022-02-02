<template>
<div></div>
</template>

<script>
export default {

  nuxtI18n: {
    paths: {
      az: '/bildirishler'
    }
  },
  head() {
    return this.$headMeta({
      title: this.$t('notifications'),
      description: this.$t('meta_desc_notifications')
    });
  },
}
</script>

<style scoped>

</style>
