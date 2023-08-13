<template>
   <div class="banner" :style="`background: url('${bg}') center center / cover no-repeat`">
      <slot name="content" />

      <h4 class="banner__title">{{ title }}</h4>
   </div>
</template>

<script>
export default {
   props: {
      bg: {
         type: String,
         default: '/img/salon-bg.png'
      },

      title: {
         type: String,
         default: 'Title'
      }
   }
}
</script>

<style lang="scss">
   .banner {
      position: relative;
      width: 100%;
      height: 280px;
      padding: 48px 64px;
      border-radius: 16px;
      overflow: hidden;

      &:before {
         content: '';
         position: absolute;
         top: 0;
         left: 0;
         width: 60%;
         height: 100%;
         background: linear-gradient(90deg, #081A3E -10.98%, rgba(0, 0, 0, 0) 100%);
      }

      &__title {
         position: absolute;
         font-weight: 700;
         font-size: 40px;
         line-height: 48px;
         color: #FFFFFF;
         margin: 0;
         bottom: 48px;
         z-index: 2;
      }

      .breadcrumbs {
         position: absolute;
         z-index: 2;
         bottom: 90px;
         margin: 0;

         ul {
            li {
               a, span, i {
                  color: #FFFFFF;
                  opacity: 0.9;
               }

               //span, i {
               //   margin-top: 3px;
               //}
            }
         }
      }
   }

   @media (max-width: 992px) {
      .banner {
         padding: 24px 36px;

         &__title {
            bottom: 30px;
         }

         .breadcrumbs {
            bottom: 70px;
         }
      }
   }

   @media (max-width: 600px) {
      .banner {
         width: 110%;
         height: 240px;
         margin: 0 -15px;
         border-radius: unset;
      }
   }

   @media (max-width: 460px) {
      .banner {
         height: 200px;
         padding: 16px;

         &__title {
            font-weight: 600;
            font-size: 28px;
            line-height: 34px;
         }

         .breadcrumbs {
            bottom: 60px;

            ul {
               li {
                  span {
                     font-weight: 500;
                     font-size: 16px;
                  }
               }
            }
         }
      }
   }
</style>
