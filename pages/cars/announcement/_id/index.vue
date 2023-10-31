<template>
   <div class="pages-cars-id product-inner">
      <div class="bg-white">
         <breadcrumbs
            :crumbs="crumbs"
            :showHome="false"
            :hasContainer="true"
         />

         <div class="container">
            <div class="product-inner__head d-none d-md-flex">
               <ProductInnerTitle :options="productInnerTitle" />

               <div class="btns">
                  <add-favorite
                     class="h-52"
                     :template="'btn'"
                     :text="$t('add_favorite')"
                     :announcement="announcement"
                     v-if="![0,2,3,4].includes(announcement.status)"
                  />

                  <add-comparison
                     v-if="comparisonExceptions"
                     class="h-52"
                     :template="'btn'"
                     :text="$t('compare')"
                     :id="announcement.id_unique"
                  />
               </div>
            </div>

            <div class="product-inner__info">
               <div class="product-inner__info-left">
                  <client-only>
                     <gallery type="cars">
                        <quick-info type="cars" brief />
                     </gallery>
                  </client-only>

                  <thumbs-gallery />

                  <template v-if="isMobileBreakpoint">
                     <ul class="characteristics">
                        <li class="characteristics__item" v-if="announcement.tradeable">
                           <inline-svg src="/icons/barter.svg" />
                           <span>{{ $t('barter') }}</span>
                        </li>

                        <li class="characteristics__item" v-if="announcement.credit">
                           <inline-svg src="/icons/credit.svg" />
                           <span>{{ $t('credit') }}</span>
                        </li>

                        <li class="characteristics__item" v-if="announcement.has_360">
                           <inline-svg src="/icons/360_deg_2.svg" />
                           <span>360</span>
                        </li>

                        <li class="characteristics__item" v-if="announcement.show_vin">
                           <inline-svg src="/icons/vin_2.svg" />
                           <span>VIN kod</span>
                           <span class="badgeMin">{{ $t('is_new') }}</span>
                        </li>
                     </ul>

                     <AnnouncementTitle :announcement="announcement" />
                  </template>

                  <announcement-specs type="cars" :title="$t('announcement_info')" brief />

                  <comment v-if="announcement.comment" :comment="announcement.comment" />

                  <car-complects :options="getComplectOptions" v-if="hasComplects" />

                  <template v-if="getCarHealth">
                     <damage-options
                        :selected="getCarHealth"
                        read-only
                        :imageIsActive="imageIsActive"
                        v-if="false"
                     />
                  </template>
               </div>

               <div class="product-inner__info-right">
                  <quick-info type="cars"/>

                  <site-banner v-if="!isMobileBreakpoint" class="mb-3" type="in-announcement" />
               </div>
            </div>
         </div>
      </div>

      <relatives />

      <HandleIds :single="true" :items="{ type: 'car', id: announcement.id }" />

      <AnnouncementBar
          v-if="isMobileBreakpoint && isActiveBar"
          :announcement="announcement"
      />
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
   import ProductInnerTitle from "~/components/announcements/ProductInnerTitle.vue";
   import AddFavorite from "~/components/announcements/AddFavorite.vue";
   import AddComparison from "~/components/announcements/AddComparison.vue";
   import AnnouncementTitle from "~/components/announcements/inner/AnnouncementTitle.vue";
   import { mapGetters } from 'vuex';
   import QuickInfoDetails from "~/components/announcements/inner/QuickInfoDetails.vue";
   import AnnouncementBar from "~/components/announcements/inner/AnnouncementBar.vue";

   export default {
      name: 'pages-cars-id',

      components: {
         AnnouncementBar,
         QuickInfoDetails,
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
         ProductInnerTitle,
         AddFavorite,
         AddComparison,
         AnnouncementTitle
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

      data() {
        return {
           isActiveBar: true
        }
      },

      async fetch({store, route}) {
         let id = route.params.id;
         if (id.length > 10) id = id.slice(0, -1);

         await Promise.all([
            store.dispatch('getAnnouncementInnerV2', id),
            store.dispatch('getComplaintOptions'),
            store.dispatch('getOptions'),
            store.dispatch('getAllOtherOptions'),
            store.dispatch('getPopularOptions'),
            store.dispatch('getSettingsV2')
         ]);
      },

      methods: {
         handleNavBar(val) {
            this.isActiveBar = !val;
         },

         getFilterLink(type) {
            let form = {
               sorting: 'created_at_desc',
               additional_brands: {0: {}, 1: {}, 2: {}, 3: {}, 4: {}},
               all_options: {},
               announce_type: 0,
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

         contact() {
            return this.getAnnouncementContact(this.announcement)
         },

         getComplectOptions() {
            return typeof this.announcement.options === 'string'
               ? JSON.parse(this.announcement.options)
               : this.announcement.options;
         },

         hasComplects() {
            console.log('this.getComplectOptions', this.getComplectOptions)
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

         comparisonExceptions() {
            return this.announcement?.type === 'light_vehicle' && ![0,2,3,4].includes(this.announcement?.status);
         },

         crumbs() {
            return [
               // {name: this.$t('cars'), route: '/cars'},
               {name: this.catalog?.brand?.name, route: this.getFilterLink('brand')},
               {name: this.catalog?.model?.name, route: this.getFilterLink('brand-model')},
               // {
               //    name: this.$translateHard(this.catalog?.generation?.name),
               //    route: this.getFilterLink('brand-model-generation')
               // },
               // {name: '#' + this.announcement.id_unique}
            ]
         },

         productInnerTitle() {
            return [
               { id: 1, name: this.catalog?.brand?.name },
               { id: 2, name: this.catalog?.model?.name },
               { id: 3, name: this.announcement.car_catalog.main[' '].obem },
               { id: 4, name: `${this.announcement.year} ${this.$t('year')}` },
               { id: 5, name: `${this.announcement.mileage} ${this.$t('char_kilometre')}` }
            ]
         }
      },

      mounted() {
         this.$nuxt.$on('changeNavbar', this.handleNavBar);
      },

      beforeDestroy() {
         this.$nuxt.$off('changeNavbar', this.handleNavBar);
      }
   }
</script>
