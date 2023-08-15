<template>
   <page-layout-moderator>
      <template #nuxt>
         <nuxt/>
      </template>
   </page-layout-moderator>
</template>

<script>
import PageLayoutModerator from '~/components/layout/PageLayoutModerator.vue';

export default {
   name: 'layout-default',
   middleware: ['main'],
   components: {
      PageLayoutModerator
   },
   mounted() {
      if (this.loggedIn) {
         this.$axios.$get('https://dev.mashin.al/api/new-notifications-count')
      }
   }
}
</script>
