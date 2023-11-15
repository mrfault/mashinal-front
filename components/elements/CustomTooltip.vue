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

<style lang="scss">
   .customTooltip {
      position: absolute;
      display: none;
      height: max-content;
      padding: 16px;
      border-radius: 12px;
      background-color: #FFF;
      border: 1px solid #CDD5DF;
      overflow: hidden;
      z-index: 15;

      .close-btn {
         min-width: 20px;
      }

      &.active {
         display: block;
      }
   }

   .dark-mode {
      .customTooltip {
         border-color: #1B2434;
         background-color: #1B2434;

         &__head {
            svg {
               &.info {
                  path {
                     fill: #CDD5DF;
                  }

                  rect {
                     fill: transparent;
                  }
               }

               &.close-btn {
                  path {
                     stroke: #CDD5DF;
                  }
               }
            }
         }
      }
   }

   @media (max-width: 600px) {
      .customTooltip {
         position: fixed;
         top: 50%;
         transform: translate(-50%, -50%) !important;
         width: 90% !important;

         &__footer {
            ul {
               li {
                  p {
                     font-size: 12px !important;
                  }
               }
            }
         }
      }
   }
</style>
