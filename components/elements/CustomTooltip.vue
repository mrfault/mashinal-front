<template>
   <div class="customTooltip">
      <div class="customTooltip__head">
         <slot name="head" />
      </div>

      <div class="customTooltip__main">
         <slot name="main" />
      </div>

      <div class="customTooltip__footer">
         <slot name="footer" />
      </div>
   </div>
</template>

<script>
   export default {

   }
</script>

<style lang="scss" scoped>
   .customTooltip {
      position: absolute;
      display: none;
      padding: 24px;
      border-radius: 12px;
      background-color: #FFF;
      z-index: 15;
   }
</style>
