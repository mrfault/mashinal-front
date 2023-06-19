<template>
   <div :class="['registrationMarksGrid', { 'loading' : value }]">
      <div class="registrationMarksGrid__head">
         <slot name="head"/>
      </div>

      <div class="registrationMarksGrid__items">
         <RegistrationMarksGridItem
            v-for="item in filteredItems"
            :key="item.id"
            :item="item"
            :moreInfo="moreInfo"
            :short-date="shortDate"
            :showFavoriteBtn="showFavoriteBtn"
            :checkbox="checkbox"
         />
      </div>
   </div>
</template>

<script>
   import RegistrationMarksGridItem from "~/components/announcements/RegistrationMarksGridItem.vue";

   export default {
      components: { RegistrationMarksGridItem },

      data() {
         return {
            loading: false
         }
      },

      props: {
         value: {
            type: Boolean
         },

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
         },

         shortDate: {
            type: Boolean,
            default: false
         },

         showFavoriteBtn: {
            type: Boolean,
            default: false
         },

         checkbox: {
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
      position: relative;

      //&__head {
      //   .form-group {
      //      width: 170px;
      //   }
      //}

      &__items {
         margin: 40px 0 0 -20px;
      }

      &.loading {
         &:before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(243, 247, 252, 0.6);
            z-index: 5;
         }
      }
   }

   .dark-mode {
      .registrationMarksGrid {
         &.loading {
            &:before {
               background-color: rgba(28, 28, 30, 0.50);
            }
         }
      }
   }

   @media (max-width: 992px) {
      .registrationMarksGrid {
         &__items {
            display: flex;
            flex-wrap: wrap;
            gap: 14px;
            margin: 40px 0 0 0;
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
      }
   }

   //@media (max-width: 400px) {
   //   .registrationMarksGrid {
   //      &__head {
   //         //margin: 0 -10px;
   //
   //         a {
   //            font-size: 16px !important;
   //         }
   //      }
   //
   //      //&__title {
   //      //   font-size: 20px;
   //      //   line-height: 22px;
   //      //}
   //   }
   //}

   //@media (max-width: 370px) {
   //   .registrationMarksGrid {
   //      //&__title {
   //      //   font-size: 17px;
   //      //}
   //   }
   //}
</style>
