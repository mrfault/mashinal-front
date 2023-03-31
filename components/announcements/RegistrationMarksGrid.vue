<template>
   <div class="registrationMarksGrid">
      <div class="registrationMarksGrid__head">
         <slot name="head"/>

      </div>

      <div class="registrationMarksGrid__items">
         <registration-marks-grid-item
            v-for="item in items"
            :key="item.id"
            :item="item"
         />
      </div>
   </div>
</template>

<script>
   import RegistrationMarksGridItem from "~/components/announcements/RegistrationMarksGridItem.vue";

   export default {
      components: { RegistrationMarksGridItem },
      props: {
         items: {
            type: Array,
            default() { return [] }
         }
      }
   }
</script>

<style lang="scss" scoped>
   .registrationMarksGrid {
      &__head {
         display: flex;
         align-items: center;
         justify-content: space-between;

         .form-group {
            width: 170px;
         }
      }

      &__title {
         font-weight: 700;
         font-size: 32px;
         line-height: 40px;
         color: #000000;
      }

      &__items {
         margin: 40px 0 0 -20px;
      }
   }
</style>