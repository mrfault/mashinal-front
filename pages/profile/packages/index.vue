<template>
   <div class="myPackages">
      <div class="container">
         <breadcrumbs :crumbs="crumbs" />

         <div class="myPackages__notification">
            <div class="divider">
               <icon name="notification" />

               <div class="myPackages__notification-text">
                  <p>Ödənilməmiş invoysunuz var!</p>
                  <p>“Standart” paketi, 24.03.2023-dən 24.04.2023-dək, <span>300 AZN</span></p>
               </div>
            </div>

            <div class="divider">
               <nuxt-link to="/profile/packages/buy" class="btn">{{ $t('pay') }}</nuxt-link>
            </div>
         </div>

         <div class="myPackages__title">Sizin aktiv paketiniz yoxdur!</div>

         <div class="myPackages__subtitle">Yeni paket əldə et</div>

         <Packages />
      </div>
   </div>
</template>

<script>
   import Packages from "~/components/profile/Packages.vue";

   export default {
      components: { Packages },

      head() {
         return this.$headMeta({
            title: this.$t('my_packages'),
         });
      },

      nuxtI18n: {
         paths: {
            az: '/profil/paketler'
         }
      },

      computed: {
         crumbs() {
            return [
               { name: this.$t('dashboard'), route: '/dashboard/3' },
               { name: this.$t('my_packages') }
            ]
         }
      }
   }
</script>

<style lang="scss" scoped>
   .myPackages {
      &__notification {
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

      &__title {
         margin: 36px 0 8px 0;
         font-weight: 500;
         font-size: 18px;
         line-height: 22px;
         color: #081A3E;
      }

      &__subtitle {
         font-weight: 400;
         font-size: 14px;
         line-height: 17px;
         color: #246EB2;
      }

      .customPackages {
         margin-top: 45px;
      }
   }
</style>
