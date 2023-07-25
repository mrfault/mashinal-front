<template>
   <div class="pages-cars-id">
      <div class="bg-white">
         <div class="container">
            <breadcrumbs :crumbs="crumbs" />

            <div class="pages-cars-id__info">
               <div class="pages-cars-id__info-left">
                  <client-only>
                     <gallery>
                        <quick-info type="cars" brief />

                        <announcement-specs type="cars" brief />
                     </gallery>
                  </client-only>

                  <thumbs-gallery />

                  <announcement-specs type="cars"/>

                  <comment :comment="announcement.comment" />

                  <car-complects :options="getComplectOptions" v-if="hasComplects"/>

                  <template v-if="getCarHealth">
                     <damage-options
                        :selected="getCarHealth"
                        read-only
                        :imageIsActive="imageIsActive"
                        v-if="false"
                     />
                  </template>
               </div>

               <div class="pages-cars-id__info-right">
                  <quick-info type="cars"/>

                  <site-banner v-if="!isMobileBreakpoint" class="mb-3" type="in-announcement"/>

                  <comment :comment="announcement.comment" v-if="isMobileBreakpoint">
                     <template #after v-if="hasComplects || getCarHealth">
                        <hr v-if="announcement.comment"/>
                        <template v-if="getCarHealth">
                           <damage-options :selected="getCarHealth" read-only v-if="false"/>
                           <hr v-if="hasComplects"/>
                        </template>
                        <car-complects :options="getComplectOptions" v-if="hasComplects"/>
                     </template>
                  </comment>
               </div>
            </div>
         </div>
      </div>

      <relatives />

      <HandleIds :single="true" :items="[announcement.id]" />
   </div>
</template>

<script>
   import QuickInfo from '~/components/announcements/inner/QuickInfo';
   import AnnouncementSpecs from '~/components/announcements/inner/AnnouncementSpecs';
   import Gallery from '~/components/announcements/inner/Gallery';
   import ThumbsGallery from '~/components/announcements/inner/ThumbsGallery';
   import Comment from '~/components/announcements/inner/Comment';
   import CarComplects from '~/components/announcements/inner/CarComplects';
   import DamageOptions from '~/components/options/DamageOptions';
   import Relatives from '~/components/announcements/inner/Relatives';
   import SiteBanner from "~/components/banners/SiteBanner";
   import HandleIds from "~/components/announcements/HandleIds.vue";
   import { mapGetters } from 'vuex';

   export default {
      name: 'pages-cars-id',

      components: {
         SiteBanner,
         QuickInfo,
         AnnouncementSpecs,
         Gallery,
         ThumbsGallery,
         Comment,
         CarComplects,
         DamageOptions,
         Relatives,
         HandleIds,
      },

      nuxtI18n: {
         paths: {
            az: '/masinlar/elan/:id'
         }
      },

      head() {
         let announcementTitle = `${this.catalog.brand.name} ${this.$translateHard(this.catalog.model.name)}`;
         let title = `${this.$t(`meta-title_announcement-${this.announcement.is_new ? 'new' : 'used'}`, {announce: `${announcementTitle}, ${this.announcement.year}`})}`;
         let description = `${announcementTitle}, ${this.$t('meta-descr_announcement', {announce: `${this.announcement.price}`})}`;
         let image = this.getAnnouncementImage(this.announcement);
         return this.$headMeta({title, description, image}, {
            category: 'Car',
            id: this.announcement.id_unique,
            autosalon: this.announcement.user.autosalon,
            brand: this.catalog.brand.name,
            model: this.catalog.model.name.replace('серия', 'seriya').replace('класс', 'klass'),
            year: this.announcement.year,
            price: {amount: this.announcement.price_int, currency: this.announcement.currency_id},
            services: this.announcement.type,
            new: this.announcement.is_new,
            available: this.announcement.status == 1,
            barter: this.announcement.exchange_possible,
            credit: this.announcement.credit
         });
      },

      async asyncData({store, route}) {
         await Promise.all([
            store.dispatch('getAnnouncementInnerV2', route.params.id),
            store.dispatch('getComplaintOptions'),
            store.dispatch('getOptions'),
            store.dispatch('getAllOtherOptions'),
            store.dispatch('getPopularOptions')
         ]);
      },

      methods: {
         getFilterLink(type) {
            let form = {
               sorting: 'created_at_desc',
               additional_brands: {0: {}, 1: {}, 2: {}, 3: {}, 4: {}},
               all_options: {},
               announce_type: 1,
               currency: 1
            }
            // insert announcement data into form
            if (type.includes('brand')) {
               form.additional_brands[0].brand = this.catalog?.brand?.id;
               form.additional_brands[0].brand_slug = this.catalog?.brand?.slug;
            }
            if (type.includes('model')) {
               form.additional_brands[0].model = this.catalog?.model?.id;
               form.additional_brands[0].model_slug = this.catalog?.model?.slug;
            }
            if (type.includes('generation')) {
               form.additional_brands[0].generation = this.catalog?.generation?.id;
            }

            return `/cars?car_filter=${encodeURI(JSON.stringify(form))}`
         }
      },

      computed: {
         ...mapGetters(['announcement', 'catalog']),
         getComplectOptions() {
            return typeof this.announcement.options === 'string'
               ? JSON.parse(this.announcement.options)
               : this.announcement.options;
         },
         hasComplects() {
            return Object.keys(this.getComplectOptions).length;
         },
         getCarHealth() {
            return this.announcement.car_body_health
               ? JSON.parse(this.announcement.car_body_health.options)
               : false;
         },
         imageIsActive() {
            return false
         },
         crumbs() {
            return [
               {name: this.$t('cars'), route: '/cars'},
               {name: this.catalog?.brand?.name, route: this.getFilterLink('brand')},
               {name: this.catalog?.model?.name, route: this.getFilterLink('brand-model')},
               {
                  name: this.$translateHard(this.catalog?.generation?.name[this.locale]),
                  route: this.getFilterLink('brand-model-generation')
               },
               {name: '#' + this.announcement.id_unique}
            ]
         }
      }
   }
</script>

<style lang="scss">
   .pages-cars-id {
      .bg-white {
         padding: 5px 0 32px 0;
      }

      &__info {
         display: grid;
         grid-template-columns: 716px 348px;
         gap: 20px;

         .inner-thumbs-gallery,
         .vehicle-specs,
         .announcement-comment,
         .car-complects {
            margin-top: 20px;
         }
      }
   }
</style>
