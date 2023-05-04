<template>
   <div class="comeBack" @click="$router.go(-1)">
      <icon :name="'chevron-left'" />

      <span class="comeBack__text">{{ text }}</span>

      <span class="comeBack__line"></span>
   </div>
</template>

<script>
   export default {
      props: {
         text: {
            type: String,
            default: 'Text'
         }
      }
   }
</script>

<style lang="scss" scoped>
   .comeBack {
      display: flex;
      align-items: center;
      width: 100%;
      height: 58px;
      padding: 0 20px;
      border-radius: 4px;
      background-color: #FFFFFF;
      margin: 20px 0;

      i {
         &:before {
            font-size: 15px;
         }
      }

      &__text {
         font-weight: 500;
         font-size: 15px;
         line-height: 18px;
         color: #081A3E;
         margin: 0 22px;
      }

      &__line {
         width: 100%;
         height: 1px;
         border-radius: 100px;
         background-color: #081A3E;
      }
   }
</style>
