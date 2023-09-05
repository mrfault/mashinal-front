<template>
   <ul class="reasonForRejection">
      <li class="reasonForRejection__item" v-for="option in options">{{option}}</li>
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
   .reasonForRejection {
      padding: 20px;
      border-radius: 12px;
      background-color: #FEF3F2;

      &__item {
         color: #F81734;
      }
   }
</style>
