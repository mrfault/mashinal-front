<template>
   <page-layout>
      <template #nuxt>
         <nuxt/>
      </template>
   </page-layout>
</template>

<script>
import PageLayout from '~/components/layout/PageLayout';

export default {
   name: 'layout-default',
   middleware: ['main'],
   components: {
      PageLayout
   },

   mounted() {
      window.ringostat_announce = parseInt(this.$route.params.id);
   }
}
</script>
