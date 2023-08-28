<template>
   <div class="pages-moto-id product-inner">
      <div class="bg-white">
         <div class="container">
            <div class="announcements-inner">
               <breadcrumbs :crumbs="crumbs" />

               <div class="product-inner__info">
                  <div class="product-inner__info-left">
                     <gallery>
                        <quick-info type="moto" brief/>
                     </gallery>

                     <thumbs-gallery />

                     <announcement-specs type="moto" :title="$t('vehicle_info')" brief/>

                     <comment :comment="announcement.comment" v-if="announcement.comment">
                        <template #before>
                           <thumbs-gallery/>
                        </template>
                     </comment>
                  </div>

                  <div class="product-inner__info-right">
                     <quick-info type="moto"/>
<!--                     <site-banner v-if="!isMobileBreakpoint" class="mb-3" type="in-announcement"/>-->
<!--                     <announcement-specs type="moto"/>-->
<!--                     <comment :comment="announcement.comment" v-if="isMobileBreakpoint"/>-->
                  </div>
               </div>

<!--               <relatives/>-->

               <HandleIds :single="true" :type="'motorcycles'" :items="[announcement.id]"/>
            </div>
         </div>
      </div>
   </div>
</template>

<script>
   import QuickInfo from '~/components/announcements/inner/QuickInfo';
   import AnnouncementSpecs from '~/components/announcements/inner/AnnouncementSpecs';
   import Gallery from '~/components/announcements/inner/Gallery';
   import ThumbsGallery from '~/components/announcements/inner/ThumbsGallery';
   import Comment from '~/components/announcements/inner/Comment';
   import Relatives from '~/components/announcements/inner/Relatives';
   import SiteBanner from "~/components/banners/SiteBanner";
   import HandleIds from "~/components/announcements/HandleIds.vue";
   import { mapGetters } from 'vuex';

   export default {
      name: 'pages-moto-id',

      components: {
         SiteBanner,
         QuickInfo,
         AnnouncementSpecs,
         Gallery,
         ThumbsGallery,
         Comment,
         Relatives,
         HandleIds
      },

      nuxtI18n: {
         paths: {
            az: '/moto/elan/:id'
         }
      },

      // head() {
      //    let announcementTitle = `${this.motoBrand.name} ${this.motoModel.name}`;
      //    let title = `${this.$t(`meta-title_announcement-${this.announcement.is_new ? 'new' : 'used'}`, {announce: `${announcementTitle}, ${this.announcement.year}`})}`;
      //    let description = `${announcementTitle}, ${this.$t('meta-descr_announcement', {announce: `${this.announcement.price}`})}`;
      //    let image = this.getAnnouncementImage(this.announcement);
      //    let category = 'Motorcycle';
      //    if (this.announcement.moto_atv_brand) category = 'Atv';
      //    else if (this.announcement.scooter_brand) category = 'Scooter';
      //    return this.$headMeta({title, description, image}, {
      //       category,
      //       id: this.announcement.id_unique,
      //       autosalon: this.announcement.user.autosalon,
      //       brand: this.motoBrand.name,
      //       model: this.motoModel.name,
      //       year: this.announcement.year,
      //       price: {amount: this.announcement.price_int, currency: this.announcement.currency_id},
      //       services: this.announcement.type,
      //       new: this.announcement.is_new,
      //       available: this.announcement.status == 1,
      //       barter: this.announcement.tradeable,
      //       credit: this.announcement.credit
      //    });
      // },

      async asyncData({store, route}) {
         await Promise.all([
            store.dispatch('getMotoInnerV2', { id: route.params.id, type: route.query.type }),
            store.dispatch('getComplaintOptions'),
            store.dispatch('getOptions'),
            store.dispatch('getMotoOptions')
         ]);
      },

      methods: {
         getFilterLink(type) {
            let form = {
               sorting: 'created_at_desc',
               additional_brands: {0: {}, 1: {}, 2: {}, 3: {}, 4: {}},
               announce_type: 0,
               currency: 1
            }
            // insert announcement data into form
            if (type.includes('brand')) {
               form.additional_brands[0].brand = this.motoBrand.id;
            }
            if (type.includes('model')) {
               form.additional_brands[0].model = this.motoModel.id;
            }

            let slug = 'motorcycles';
            if (this.announcement.moto_atv_brand) slug = 'atvs';
            else if (this.announcement.scooter_brand) slug = 'scooters';
            return `/moto/${this.$t('slug_' + slug)}?filter=${encodeURI(JSON.stringify(form))}`
         }
      },

      computed: {
         ...mapGetters(['announcement']),

         motoBrand() {
            console.log('this.announcement222', this.announcement)
            return this.announcement?.brand || this.announcement?.moto_atv_brand || this.announcement?.scooter_brand;
         },

         motoModel() {
            return this.announcement?.model || this.announcement?.moto_atv_model || this.announcement?.scooter_model;
         },

         crumbs() {
            return [
               {name: this.$t('moto'), route: '/moto'},
               {name: this.motoBrand.name, route: this.getFilterLink('brand')},
               {name: this.motoModel.name, route: this.getFilterLink('brand-model')},
               {name: '#' + this.announcement.id_unique}
            ]
         }
      }
   }
</script>
