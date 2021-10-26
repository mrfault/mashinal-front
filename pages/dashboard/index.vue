<template>
  <div></div>
</template>

<script>
export default {
  name: 'page-dashboard-index',
  middleware: 'auth_salon',
  nuxtI18n: {
    paths: {
      az: '/idareetme-paneli'
    }
  }
}
</script>