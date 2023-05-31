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

<style lang="scss">
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

      .select-menu_label {
         .text-truncate {
            margin-right: 15px;
         }
      }
   }

   @media (max-width: 992px) {
      .cap {
         h3 {
            font-size: 25px;
         }
      }
   }

   @media (max-width: 570px) {
      .cap {
         h3 {
            font-size: 22px;
         }

         .form-group {
            .select-menu {
               &_label {
                  font-size: 15px;
                  height: 48px;
               }
            }
         }
      }
   }

   @media (max-width: 375px) {
      .cap {
         h3 {
            font-size: 20px;
         }
      }
   }
</style>
