<template>
   <div :class="['cap', className]">
      <div class="divider">
         <slot name="left" />
      </div>

      <div class="divider">
         <slot name="right" />
      </div>
   </div>
</template>

<script>
   export default {
      props: {
         className: {
            type: String
         }
      }
   }
</script>

<style lang="scss" scoped>
   .cap {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;

      h3 {
         font-weight: 700;
         font-size: 28px;
         line-height: 32px;
         color: #121926;
      }

      a {
         display: flex;
         align-items: center;
         font-weight: 600;
         font-size: 18px;
         line-height: 22px;
         color: #121926;
         gap: 10px;
         transition: all .2s;

         &:hover {
            color: #004EEB;
         }
      }
   }
</style>
