<template>
   <ul class="productInnerTitle">
      <li
         class="productInnerTitle__item"
         v-for="option in options"
         :key="option.id"
      >{{ option.name }}</li>
   </ul>
</template>

<script>
   export default {
      props: {
         options: {
            type: Array,
            default() { return [] }
         }
      }
   }
</script>

<style lang="scss" scoped>
   .productInnerTitle {
      display: flex;
      align-items: center;

      &__item {
         position: relative;
         color: #1B2434;
         font-size: 20px;
         font-weight: 600;
         line-height: 28px;

         &:not(:last-child) {
            &:after {
               content: ',';
               margin-right: 5px;
            }
         }
      }
   }

   .dark-mode {
      .productInnerTitle {
         &__item {
            color: #fff;
         }
      }
   }
</style>
