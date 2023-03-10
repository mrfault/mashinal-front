<template>
   <div :class="['customRadio', className]">
      <h4 class="customRadio__title">
         <slot name="title" />
      </h4>

      <div class="customRadio__inner">
         <slot name="content" />
      </div>
   </div>
</template>

<script>
   export default {
      props: {
         className: {
            type: String,
            default: ''
         }
      }
   }
</script>

<style lang="scss" scoped>
   .customRadio {
      &__title {
         font-weight: 400;
         font-size: 16px;
         line-height: 20px;
         color: #1B2434;
         margin-bottom: 12px;
      }

      &__inner {
         display: flex;
         align-items: center;
      }

      &__content {
         &:not(:first-child) {
            margin-left: 16px;
         }
      }

      input {
         display: none;
         &:checked {
            & + label {
               border-color: #155EEF;

               span {
                  font-weight: 500;
                  color: #121926;
               }
            }
         }
      }

      label {
         display: flex;
         align-items: center;
         margin: 0;
         padding: 14px 16px;
         border-radius: 8px;
         border: 1px solid #CDD5DF;
         background-color: #FFFFFF;
         cursor: pointer;

         span {
            margin-left: 10px;
            font-size: 16px;
            color: #364152;
         }
      }
   }
</style>