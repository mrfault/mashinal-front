<template>
  <nuxt-child>
    <template #search-nav>
      <search-nav v-if="isMobileBreakpoint" />
    </template>
  </nuxt-child>
</template>

<script>
import SearchNav from '~/components/layout/SearchNav';

export default {
  name: 'pages-commercial',
  components: {
    SearchNav
  }
}
</script>