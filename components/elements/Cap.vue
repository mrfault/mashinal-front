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
         color: var(--gray-900, #121926);
         font-size: 28px;
         font-style: normal;
         font-weight: 700;
         line-height: 32px;
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

         //&:hover {
         //   color: #004EEB;
         //}
      }

      p {
         cursor: pointer;

         //&:hover {
         //   span {
         //      color: #004EEB;
         //   }
         //
         //   svg {
         //      path {
         //         fill: #004EEB;
         //      }
         //   }
         //}

         span {
            color: var(--gray-600, #4B5565);
            text-align: right;
            font-size: 20px;
            font-style: normal;
            font-weight: 600;
            line-height: 24px;
            margin-right: 10px;
            text-decoration-line: underline;
         }
      }

      .select-menu_label {
         .text-truncate {
            margin-right: 15px;
         }
      }
   }

   .dark-mode {
      .cap {
         a {
            //&:hover {
            //   color: #84ADFF;
            //}
         }

         p {
            //&:hover {
            //   span {
            //      color: #84ADFF;
            //   }
            //
            //   svg {
            //      path {
            //         fill:#84ADFF;
            //      }
            //   }
            //}
         }

         h3, span {
            color: #EEF2F6;
         }

         svg {
            path {
               fill: #CDD5DF;
            }
         }

         .form-group {
            .select-menu {
               &_label {
                  background-color: #1B2434 !important;
               }
            }
         }

         .icon-arrow-right {
            color: #EEF2F6;
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
            font-size: 20px;
            padding-right: 8px;
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
            font-size: 18px;
         }
      }
   }
</style>
