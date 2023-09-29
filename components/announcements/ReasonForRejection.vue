<template>
   <div class="reasonForRejection">
      <div class="reasonForRejection__list">
         <p
            class="reasonForRejection__list-item"
            v-for="(option, i) in options"
            :key="i"
         >{{ i + 1 }}. {{ option }}</p>
      </div>

      <inline-svg src="/icons/warning.svg" />
   </div>
</template>

<script>
   export default {
      props: {
         options: {
            type: Array,
            default() {
               return []
            }
         }
      }
   }
</script>

<style lang="scss" scoped>
   .reasonForRejection {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px;
      border-radius: 12px;
      background-color: #F9425A;

      &__list {
         &-item {
            line-height: 16px;
            color: #FFF;

            &:not(:first-child) {
               margin-top: 10px;
            }
         }
      }

      svg {
         opacity: .2;
      }
   }

   //.dark-mode {
   //   .reasonForRejection {
   //      &__list {
   //         &-item {
   //            color: #EEF2F6;
   //         }
   //      }
   //   }
   //}
</style>
