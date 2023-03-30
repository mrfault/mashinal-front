<template>
   <div class="registrationMarks">
      <div class="container">
         <breadcrumbs :crumbs="crumbs" />

         Index

      </div>
   </div>
</template>

<script>
   export default {
      computed: {
         crumbs() {
            return [{ name: this.$t('registration_marks') }]
         }
      }
   }
</script>

<style lang="scss" scoped>

</style>