<template>
   <div class="myPackagesBuy">
      <div class="container">
         <breadcrumbs :crumbs="crumbs" />

         <div class="myPackagesBuy__inner">
            sdsd
         </div>
      </div>
   </div>
</template>

<script>
   export default {
      head() {
         return this.$headMeta({
            title: this.$t('my_packages'),
            description: this.$t('registration2')
         });
      },

      nuxtI18n: {
         paths: {
            az: '/profil/paketler/resmilesdirme'
         }
      },

      computed: {
         crumbs() {
            return [
               { name: this.$t('dashboard'), route: '/dashboard/3' },
               { name: this.$t('my_packages'), route: '/profile/packages' },
               { name: this.$t('registration2') }
            ]
         }
      }
   }
</script>

<style lang="scss" scoped>
   .myPackagesBuy {

   }
</style>
