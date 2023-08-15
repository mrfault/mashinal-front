<template>
   <page-layout>
      <!--    <template #after-header>-->
      <!--      <search-nav v-if="isMobileBreakpoint" />-->
      <!--    </template>-->
      <template #nuxt>
         <nuxt/>
      </template>
   </page-layout>
</template>

<script>
import PageLayout from '~/components/layout/PageLayout';
import SearchNav from '~/components/layout/SearchNav';

export default {
   name: 'layout-search',
   middleware: 'main',
   components: {
      PageLayout,
      SearchNav
   },
   mounted() {
      this.$axios.$get('https://dev.mashin.al/api/new-notifications-count')
   }
}
</script>
