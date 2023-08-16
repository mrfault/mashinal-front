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

      components: { PageLayout },


      mounted(){
         if (this.loggedIn) {
            this.$axios.$get('https://dev.mashin.al/api/new-notifications-count')
         }
      }
   }
</script>
