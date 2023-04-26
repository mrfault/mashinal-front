<template>
   <div class="myPackages">
      <div class="container">
         <breadcrumbs :crumbs="crumbs"/>

      </div>
   </div>
</template>

<script>
   export default {
      computed: {
         crumbs() {
            return [
               { name: this.$t('dashboard'), route: '/dashboard/3' },
               { name: this.$t('my_packages') }
            ]
         }
      }
   }
</script>

<style lang="scss" scoped>
   .myPackages {

   }
</style>
