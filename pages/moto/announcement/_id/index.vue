<template>
   <div class="pages-moto-id product-inner">
      <div class="bg-white">
         <div class="container">
            <div class="announcements-inner">
               <breadcrumbs :crumbs="crumbs" />

               <div class="product-inner__info">
                  <div class="product-inner__info-left">
                     <client-only>
                        <gallery type="moto">
                           <quick-info type="moto" brief/>
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

                        <QuickInfoDetails
                            :announcement="announcement"
                            :contact="contact"
                        >
                           <template #head>
                              <AnnouncementTitle :announcement="announcement" />
                           </template>
                        </QuickInfoDetails>
                     </template>

                     <announcement-specs type="moto" :title="$t('announcement_info')" brief/>

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
            </div>
         </div>
      </div>

      <relatives />

      <HandleIds :single="true" :items="{ type: $route.query?.type, id: announcement.id }" />
   </div>
</template>

<script>
   import Grid from "~/components/announcements/Grid.vue";
   import Cap from "~/components/elements/Cap.vue";
   import QuickInfo from '~/components/announcements/inner/QuickInfo';
   import AnnouncementSpecs from '~/components/announcements/inner/AnnouncementSpecs';
   import Gallery from '~/components/announcements/inner/Gallery';
   import ThumbsGallery from '~/components/announcements/inner/ThumbsGallery';
   import Comment from '~/components/announcements/inner/Comment';
   import Relatives from '~/components/announcements/inner/Relatives';
   import SiteBanner from "~/components/banners/SiteBanner";
   import HandleIds from "~/components/announcements/HandleIds.vue";
   import { mapGetters } from 'vuex';
   import QuickInfoDetails from "~/components/announcements/inner/QuickInfoDetails.vue";
   import AnnouncementTitle from "~/components/announcements/inner/AnnouncementTitle.vue";

   export default {
      name: 'pages-moto-id',

      components: {
         AnnouncementTitle, QuickInfoDetails,
         Grid,
         Cap,
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

     head() {
        let announcementTitle = `${this.motoBrand.name} ${this.motoModel.name}`;
        let title = `${this.$t(`meta-title_announcement-${this.announcement.is_new ? 'new' : 'used'}`, {announce: `${announcementTitle}, ${this.announcement.year}`})}`;
        let description = `${announcementTitle}, ${this.$t('meta-descr_announcement', {announce: `${this.announcement.price}`})}`;
        let image = this.getAnnouncementImage(this.announcement);
        let category = 'Motorcycle';
        if (this.announcement.moto_atv_brand) category = 'Atv';
        else if (this.announcement.scooter_brand) category = 'Scooter';
        return this.$headMeta({title, description, image}, {
           category,
           id: this.announcement.id_unique,
           autosalon: this.announcement.user.autosalon,
           brand: this.motoBrand.name,
           model: this.motoModel.name,
           year: this.announcement.year,
           price: {amount: this.announcement.price_int, currency: this.announcement.currency_id},
           services: this.announcement.type,
           new: this.announcement.is_new,
           available: this.announcement.status == 1,
           barter: this.announcement.tradeable,
           credit: this.announcement.credit
        });
     },

      async asyncData({store, route}) {
         if (route.params.id) {
            let types = { 1: 'motorcycle', 2: 'scooter', 3: 'atv' },
               type = parseInt(route?.params?.id?.slice(-1)),
               id = route?.params?.id?.slice(0, route?.params?.id?.length - 1);

            console.log('route?.params?.id', route?.params?.id)
            console.log('id', id)

            await store.dispatch('getMotoInnerV2', { id: id, type: types[type] });
            // await store.dispatch('motoRelativesV2', { id: id, type: types[type] });
         }

         await Promise.all([
            store.dispatch('getComplaintOptions'),
            store.dispatch('getOptions'),
            store.dispatch('getMotoOptions'),
            store.dispatch('getSettingsV2')
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
               form.moto_type = this.$route.query.type
            switch (form.moto_type) {
               case 'motorcycle':
                  form.additional_brands[0].category = 1;
                  break;
               case 'scooter':
                  form.additional_brands[0].category = 2;
                  break;
               case 'moto_atv':
                  form.additional_brands[0].category = 3;
                  break;
            }
            return `/moto?filter=${encodeURI(JSON.stringify(form))}`
         }
      },

      computed: {
         ...mapGetters(['announcement', 'motoRelatives']),

         contact() {
            return this.getAnnouncementContact(this.announcement)
         },

         motoBrand() {
            return this.announcement?.brand;
         },

         motoModel() {
            return this.announcement?.model;
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

<style lang="scss">
   .pages-moto-id {
      .breadcrumbs {
         border: none;
         padding: 20px 0;
      }
   }
</style>
