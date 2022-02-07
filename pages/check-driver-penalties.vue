<template>
  <div class="pages-dashboard pt-2 pt-lg-5">
    <div class="container">
      <breadcrumbs :crumbs="crumbs" />

      <check-driver-points></check-driver-points>
    </div>
  </div>
</template>

<script>
import CheckDriverPoints from '~/components/garage/CheckDriverPoints.vue'
export default {
  components: {
    CheckDriverPoints,
  },
  nuxtI18n: {
    paths: {
      az: '/bal-yoxla',
    },
  },
  head() {
    return this.$headMeta({
      title: this.$t('check_penalty2'),
    })
  },
  data() {
    return {}
  },
  computed: {
    crumbs() {
      return [{ name: this.$t('check_penalty2') }]
    },
  },
}
</script>

<style></style>
