<template>
   <div class="registrationMarksGrid">
      <div class="registrationMarksGrid__head">
         <slot name="head"/>
      </div>

      <div class="registrationMarksGrid__items">
         <registration-marks-grid-item
            v-for="item in filteredItems"
            :key="item.id"
            :item="item"
            :moreInfo="moreInfo"
         />

<!--         <pre>{{filteredItems[0]}}</pre>-->
      </div>
   </div>
</template>

<script>
   import RegistrationMarksGridItem from "~/components/announcements/RegistrationMarksGridItem.vue";

   export default {
      components: { RegistrationMarksGridItem },

      props: {
         isFiltered: {
            type: Boolean,
            default: false
         },

         items: {
            type: Array,
            default() { return [] }
         },

         moreInfo: {
            type: Boolean,
            default: false
         }
      },

      computed: {
         filteredItems() {
            if(!this.isFiltered) {
               return this.items;
            } else {
               return this.items.filter(item => item.type === 6);
            }
         }
      }
   }
</script>

<style lang="scss">
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
         margin: 0;
      }

      &__items {
         margin: 40px 0 0 -20px;
      }
   }

   @media (max-width: 540px) {
      .registrationMarksGrid {
         &__title {
            font-size: 28px;
         }

         &__items {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            margin: 40px 0 0 0;
         }
      }
   }

   @media (max-width: 500px) {
      .registrationMarksGrid {
         &__title {
            font-size: 24px;
         }
      }
   }

   @media (max-width: 430px) {
      .registrationMarksGrid {
         &__head {
            .form-group {
               width: 130px;
            }

            .select-menu_label {
               padding: 22px 10px !important;
            }
         }

         &__title {
            font-size: 22px;
         }
      }
   }

   @media (max-width: 370px) {
      .registrationMarksGrid {
         &__head {
            margin: 0 -10px;
         }

         &__title {
            font-size: 17px;
         }
      }
   }
</style>
