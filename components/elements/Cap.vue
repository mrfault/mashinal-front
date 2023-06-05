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

      p {
         cursor: pointer;

         &:hover {
            span {
               color: #004EEB;
            }

            svg {
               path {
                  fill: #004EEB;
               }
            }
         }

         span {
            font-weight: 600;
            font-size: 20px;
            line-height: 24px;
            text-decoration-line: underline;
            color: #4B5565;
            margin-right: 10px;
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
            &:hover {
               color: #84ADFF;
            }
         }

         p {
            &:hover {
               span {
                  color: #84ADFF;
               }

               svg {
                  path {
                     fill:#84ADFF;
                  }
               }
            }
         }

         h3, span {
            color: #CDD5DF;
         }

         svg {
            path {
               fill: #CDD5DF;
            }
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
