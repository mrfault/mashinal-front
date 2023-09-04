<template>
   <div class="filtersMobile">
<!--      <pre>{{selectedItems}}</pre>-->
      <ul class="filtersMobile__list">
         <li
            class="filtersMobile__list-item"
            v-for="item in list"
            :key="item.id"
            @click="$emit('onClick', item.id)"
         >
            <span>{{ item.name }}</span>
            <inline-svg :src="item.icon" />
         </li>
      </ul>
   </div>
</template>

<script>
   export default {
      props: {
         selectedItems: {
            type: Object,
            default() { return {} }
         }
      },

      computed: {
         list() {
            return [
               { id: 1, name: this.$t('mark'), icon: '/icons/car-3.svg' },
               { id: 2, name: this.$t('advanced_search'), icon: '/icons/filter.svg' }
            ]
         }
      }
   }
</script>

<style lang="scss">
   .filtersMobile {
      border-radius: 12px;
      background-color: #FFFFFF;

      &__list {
         &-item {
            display: flex;
            align-items: center;
            justify-content: space-between;

            span {
               color: #364152;
               font-size: 16px;
               font-weight: 500;
               line-height: 20px;
            }

            &:not(:first-child) {
               margin-top: 18px;
               padding-top: 18px;
               border-top: 1px solid #E3E8EF;
            }
         }
      }
   }

   .dark-mode {
      .filtersMobile {
         background-color: #1B2434;

         &__list {
            &-item {
               span {
                  color: #9AA4B2;
               }

               svg {
                  path {
                     fill: #9AA4B2;
                  }

                  line {
                     stroke: #9AA4B2;
                  }

                  circle {
                     fill: #9AA4B2;
                     stroke: #1B2434;
                  }
               }

               &:not(:first-child) {
                  border-color: #364152;
               }
            }
         }
      }
   }
</style>
