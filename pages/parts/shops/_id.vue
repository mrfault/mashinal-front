<template>
  <div class="pages-parts-shops-id">
    <div class="container">
<!--      <breadcrumbs :crumbs="crumbs" />-->
      <salon-inner />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import SalonInner from '~/components/salons/SalonInner';

export default {
  name: 'pages-parts-shops-id',
  components: {
    SalonInner
  },
  nuxtI18n: {
    paths: {
      az: '/ehtiyat-hisseleri/magazalar/:id'
    }
  },
  head() {
    return this.$headMeta({
      title: `${ this.$t('shop') } "${this.salonSingle.name || this.salonSingle.user.full_name}" | ${this.$t('parts_shops')}`,
      description: this.salonSingle.short_description
    });
  },
  async asyncData({ store, route }) {
    await Promise.all([
      store.dispatch('getSalonById', {slug: route.params.id,page: (route.query.page || 1)}),
      store.dispatch('getMotoOptions'),
    ]);
  },
  computed: {
    ...mapGetters(['salonSingle']),

    crumbs() {
      return [
        { name: this.$t('parts'), route: '/parts' },
        { name: this.$t('shops'), route: '/parts/shops' },
        { name: this.salonSingle.name || this.salonSingle.user.full_name }
      ]
    }
  }
}
</script>

<style lang="scss">
@media (max-width: 1150px) {
   .pages-parts-shops-id {
      .salon-single-card {
         padding: 0 !important;
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
            .count {
               bottom: 38px;
            }
         }
      }
   }
}

@media (max-width: 992px) {
   .pages-parts-shops-id {
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
   .pages-parts-shops-id {
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
   .pages-parts-shops-id {
      .salon-inner {
         .profile-card {
            width: 108%;
         }
      }
   }
}

@media (max-width: 385px) {
   .pages-parts-shops-id {
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
