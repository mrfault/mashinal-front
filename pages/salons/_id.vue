<template>
    <div class="pages-salons-id">
        <div class="container">
<!--            <breadcrumbs :crumbs="crumbs" />-->

            <salon-inner />
        </div>
    </div>
</template>

<script>
   import {mapGetters} from 'vuex';
   import SalonInner from '~/components/salons/SalonInner';

   export default {
       name: 'pages-salons-id',

       components: {
           SalonInner
       },

       nuxtI18n: {
           paths: {
               az: '/salon/:id'
           }
       },

       head() {
           return this.$headMeta({
               title: `${this.$t('autosalon')} "${this.salonSingle.name || this.salonSingle.user.full_name}" | ${this.$t('salons')}`,
               description: this.salonSingle.short_description
           });
       },

       async asyncData({store, route}) {
           await Promise.all([
               store.dispatch('getSalonById', { slug: route.params.id, sorting: 'created_at_desc' }),
               store.dispatch('getMotoOptions'),
           ]);

       },

       mounted() {
           this.$store.commit('mutate', {
               property: 'announcement',
               value: {}
           })
       },

       computed: {
           ...mapGetters(['salonSingle']),

           crumbs() {
               return [
                   {name: this.$t('salons'), route: '/salons'},
                   {name: this.salonSingle.name || this.salonSingle.user.full_name}
               ]
           }
       }
   }
</script>

<style lang="scss">
   @media (max-width: 1150px) {
      .pages-salons-id {
         .salon-single-card {
            padding: 0;
         }

         .cover-with-avatar {
            height: 300px;

            &__img {
               max-width: 680px;
            }

            &__gallery {
               &-item {
                  height: 92px;
               }
            }
         }
      }
   }

   @media (max-width: 992px) {
      .pages-salons-id {
         .salon-inner {
            &__details {
               flex-direction: column;

               &-right {
                  max-width: unset;
               }

               .inner-thumbs-gallery {
                  margin: 20px 0;

                  .swiper-slide {
                     width: 100px;
                  }
               }
            }
         }
      }
   }

   @media (max-width: 600px) {
      .pages-salons-id {
         .salon-inner {
            &__details {
               position: relative;
               margin-top: unset;
               overflow: unset;
               padding: 61px 16px 16px;

               &-logo {
                  position: absolute;
                  top: -110px;
                  left: 0;
                  max-width: 88px;
                  height: 88px;
                  margin-right: unset;
               }

               &-right {
                  margin-top: -20px;
               }

               &-tels {
                  padding: 12px 18px;
               }
            }

            .profile-card {
               width: 106%;
               margin: 0 -15px;

               .cover-with-avatar {
                  height: 200px;

                  img {
                     border-radius: unset;
                  }
               }
            }
         }
      }
   }

   @media (max-width: 500px) {
      .pages-salons-id {
         .salon-inner {
            .profile-card {
               width: 108%;
            }
         }
      }
   }

   @media (max-width: 385px) {
      .pages-salons-id {
         .salon-inner {
            &__details {

               &-tels {
                  padding: 12px;

                  .icon-phone-call {
                     font-size: 20px;
                     margin-right: 10px;
                  }

                  .divider {
                     padding-right: 15px;
                  }

                  ul {
                     li {
                        a {
                           font-size: 13px;
                        }
                     }
                  }
               }
            }

            .profile-card {
               width: 110%;
            }
         }
      }
   }
</style>
