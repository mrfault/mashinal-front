<template>
   <div class="customNotification">
      <div class="divider">
         <icon name="notification" />

         <div class="customNotification-text">
            <p>{{ title }}</p>
            <p>“Standart” paketi, 24.03.2023-dən 24.04.2023-dək, <span>300 AZN</span></p>
         </div>
      </div>

      <div class="divider">
         <nuxt-link to="/profile/packages/buy" class="btn">{{ $t('pay') }}</nuxt-link>
      </div>
   </div>
</template>

<script>
   export default {
      props: {
         title: {
            type: String,
            default: 'Title'
         },

         subtitle: {
            type: String,
            default: 'Subtitle'
         }
      }
   }
</script>

<style lang="scss" scoped>
   .customNotification {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 21px 24px;
      border-radius: 4px;
      background-color: #FFFFFF;

      &-text {
         p {
            font-weight: 500;
            margin: 0;

            &:first-child {
               font-size: 16px;
               line-height: 19px;
               color: #081A3E;
               margin-bottom: 4px;
            }

            &:last-child {
               font-size: 14px;
               line-height: 17px;
               color: #246EB2;

               span {
                  color: red;
               }
            }
         }
      }

      .divider {
         display: flex;
         align-items: center;

         i {
            margin-right: 12px;

            &:before {
               font-size: 20px;
            }
         }

         .btn {
            height: 42px;
            padding: 0 36px;
            color: #FFFFFF;
            background-color: #246EB2;
         }
      }
   }

   @media (max-width: 992px) {
      .customNotification {
         flex-direction: column;
         align-items: flex-start;
         padding: 20px 15px;

         .divider {
            &:last-child {
               margin-top: 20px;
            }
         }
      }
   }

   @media (max-width: 576px) {
      .customNotification {
         &-text {
            p {
               &:first-child {
                  font-size: 15px;
               }

               &:last-child {
                  font-size: 12px;
                  line-height: 15px;
               }
            }
         }

         .divider {
            .btn {
               height: 34px;
            }
         }
      }
   }
</style>
