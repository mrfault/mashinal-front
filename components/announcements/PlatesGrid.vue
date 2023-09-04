<template>
   <div :class="['registrationMarksGrid', { 'loading' : value }]">
      <div class="registrationMarksGrid__head">
         <slot name="head"/>
      </div>

      <div class="registrationMarksGrid__items">
         <PlatesGridItem
            v-for="(item, i) in filteredItems"
            :key="item.id + (escapeDuplicates ? '_' + i : '')"
            :item="item"
            :moreInfo="moreInfo"
            :short-date="shortDate"
            :showFavoriteBtn="showFavoriteBtn"
            :checkbox="checkbox"
            :escapeDuplicates="true"
         />
      </div>
   </div>
</template>

<script>
   import PlatesGridItem from "~/components/announcements/PlatesGridItem.vue";

   export default {
      components: { PlatesGridItem },

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

         escapeDuplicates: Boolean,

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
      margin: 56px 0;

      &__items {
         display: grid;
         gap: 20px;
         grid-template-columns: repeat(4, 1fr);
         margin-top: 48px;
      }

      &.loading {
         &:before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(238, 242, 246, 0.6);
            z-index: 5;
         }
      }
   }

   .dark-mode {
      .registrationMarksGrid {
         &.loading {
            &:before {
               background-color: #1219265e;
            }
         }
      }
   }

   @media (max-width: 992px) {
      .registrationMarksGrid {
         &__items {
            grid-template-columns: repeat(2, 1fr);
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

         &__items {
            gap: 10px;
         }
      }
   }
</style>
