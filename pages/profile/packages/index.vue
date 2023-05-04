<template>
   <div class="myPackages">
      <div class="container">
         <ComeBack :text="$t('my_packages')" v-if="isMobileBreakpoint" />

         <breadcrumbs :crumbs="crumbs" />

<!--         <CustomNotifications-->
<!--            :title="$t('unpaid_invoice')"-->
<!--         />-->

         <h4 class="myPackages__title">{{ $t('not_active_package') }}</h4>

         <h5 class="myPackages__subtitle">{{ $t('get_new_package') }}</h5>

         <Packages :packages="getPackages" />
      </div>
   </div>
</template>

<script>
   import Packages from "~/components/profile/Packages.vue";
   import CustomNotifications from "~/components/elements/CustomNotifications.vue";
   import ComeBack from "~/components/elements/ComeBack.vue";
   import { mapGetters } from "vuex";

   export default {
      components: { Packages, CustomNotifications, ComeBack },

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
         ...mapGetters({
            getPackages: 'packages/getPackages'
         }),

         crumbs() {
            return [
               { name: this.$t('dashboard'), route: '/dashboard/3' },
               { name: this.$t('my_packages') }
            ]
         }
      },

      async asyncData({ store }) {
         await store.dispatch('packages/getPackages');
      }
   }
</script>

<style lang="scss">
   .myPackages {
      padding-bottom: 100px;

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
         margin: 0;
      }

      .customPackages {
         margin: 45px -25px 0 -25px;
      }

      .swiper-container {
         padding-top: 25px;

         .swiper-wrapper {
            align-items: stretch;
            height: unset !important;
         }
      }

      * {
         box-sizing: border-box;
      }
   }

   @media (max-width: 1250px) {
      .myPackages {
         .customPackages {
            &__info {
               &-item {
                  font-size: 13px;
               }
            }
         }
      }
   }

   @media (max-width: 992px) {
      .myPackages {
         .customPackages {
            &__info {
               &-item {
                  font-size: 12px;

                  svg {
                     max-width: 20px;
                     width: 100%;
                  }
               }
            }
         }
      }
   }

   @media (max-width: 370px) {
      .myPackages {
         .customPackages {
            &__subtitle {
               font-size: 35px;
            }

            &__info {
               &-item {
                  font-size: 12px;

                  svg {
                     max-width: 20px;
                     width: 100%;
                  }
               }
            }
         }
      }
   }

   @media (min-width: 550px) {
      .myPackages {
         .customPackages {
            margin: 45px 0 0 0;
         }
      }
   }
</style>
