<template>
   <div class="pages-parts-id product-inner">
      <div class="bg-white">
         <div class="container">
            <div class="product-inner__head">
               <breadcrumbs :crumbs="crumbs" />

               <div class="btns d-none d-md-block">
                  <add-favorite
                     class="h-52"
                     :template="'btn'"
                     :text="$t('add_favorite')"
                     :announcement="announcement"
                     v-if="![0,2,3,4].includes(announcement.status)"
                  />
               </div>
            </div>

            <div class="product-inner__info">
               <div class="product-inner__info-left">
                  <client-only>
                     <gallery type="parts">
                        <quick-info type="parts" brief />
                     </gallery>
                  </client-only>

                  <thumbs-gallery />

                  <template v-if="isMobileBreakpoint">
                     <QuickInfoDetails
                         :announcement="announcement"
                         :contact="contact"
                     >
                        <template #head>
                           <AnnouncementTitle :announcement="announcement" />
                        </template>
                     </QuickInfoDetails>
                  </template>

                  <announcement-specs type="parts" :title="$t('announcement_info')" />

                  <comment :comment="announcement.comment" v-if="announcement.comment">
                     <template #before>
                        <thumbs-gallery/>
                     </template>

                     <template #after>
                        <collapse-content
                           v-if="announcement.description"
                           :title="$t('seller_comment')"
                           :first-collapsed="false"
                        >
                           <p v-html="$nl2br(announcement.description)"></p>
                        </collapse-content>
                     </template>
                  </comment>
               </div>

               <div class="product-inner__info-right">
                  <quick-info type="parts"/>

                  <site-banner v-if="!isMobileBreakpoint" class="mb-3" type="in-announcement"/>
               </div>
            </div>
         </div>
      </div>

      <grid
         class="dark-bg"
         v-if="autosalonAnnouncementsId?.length"
         :announcements="autosalonAnnouncementsId"
         escape-duplicates
      >
         <template #cap>
            <Cap :className="'mb40'">
               <template #left>
                  <h3>{{ $t('relative_announcements') }}</h3>
               </template>
            </Cap>
         </template>
      </grid>

      <relatives />

<!--      <HandleIds :single="true" :items="{ type: 'parts', id: announcement.id }" />-->

      <AnnouncementBar
          v-if="isMobileBreakpoint"
          :announcement="announcement"
      />
   </div>
</template>

<script>
   import Cap from "~/components/elements/Cap.vue";
   import Grid from "~/components/announcements/Grid.vue";
   import Gallery from '~/components/announcements/inner/Gallery';
   import Comment from '~/components/announcements/inner/Comment';
   import QuickInfo from '~/components/announcements/inner/QuickInfo';
   import AnnouncementSpecs from '~/components/announcements/inner/AnnouncementSpecs';
   import ThumbsGallery from '~/components/announcements/inner/ThumbsGallery';
   import CollapseContent from '~/components/elements/CollapseContent';
   import Keywords from '~/components/announcements/inner/Keywords';
   import Relatives from '~/components/announcements/inner/Relatives';
   import SiteBanner from "~/components/banners/SiteBanner";
   import HandleIds from "~/components/announcements/HandleIds.vue";
   import { mapGetters } from 'vuex';
   import QuickInfoDetails from "~/components/announcements/inner/QuickInfoDetails.vue";
   import AnnouncementTitle from "~/components/announcements/inner/AnnouncementTitle.vue";
   import AnnouncementBar from "~/components/announcements/inner/AnnouncementBar.vue";
   import AddFavorite from "~/components/announcements/AddFavorite.vue";

   export default {
      name: 'pages-parts-id',

      components: {
         AddFavorite,
         AnnouncementBar,
         AnnouncementTitle, QuickInfoDetails,
         SiteBanner,
         Gallery,
         Comment,
         QuickInfo,
         AnnouncementSpecs,
         ThumbsGallery,
         CollapseContent,
         Keywords,
         Relatives,
         HandleIds,
         Grid,
         Cap
      },

      nuxtI18n: {
         paths: {
            az: '/ehtiyat-hisseleri/elan/:id'
         }
      },

      head() {
         let announcementTitle = this.getAnnouncementTitle(this.announcement),
             title = `${this.$t(`meta-title_announcement-${this.announcement.is_new ? 'new' : 'used'}`, {announce: `${announcementTitle}`})}`,
             description = `${announcementTitle}, ${this.$t('meta-descr_announcement', {announce: `${this.announcement.price}`})}`,
             image = this.getAnnouncementImage(this.announcement);
         return this.$headMeta({title, description, image});
      },

      async asyncData({store, route}) {
         let id = route.params.id;
         if (id.length > 10) id = id.slice(0, -1);

         await Promise.all([
            store.dispatch('getPartsInnerV2', id),
            // store.dispatch('fetchPartsAnnouncementsId', route.params.id),
            store.dispatch('getComplaintOptions'),
            store.dispatch('getOptions'),
            store.dispatch('getAllOtherOptions')
         ]);
      },

      methods: {
         keywordOnClick(keyword) {
            this.$router.push(`${this.$localePath('/parts')}?parts_filter=${JSON.stringify({text: keyword.name})}`)
         }
      },

      computed: {
         ...mapGetters(['announcement', 'autosalonAnnouncementsId']),

         contact() {
            return this.getAnnouncementContact(this.announcement)
         },

         crumbs() {
            const items = [
               {
                  name: this.$t('all_parts'),
                  route: '/parts'
               },
               // {
               //    name: this.announcement?.category?.name[this.locale],
               //    route: `/parts/${this.announcement?.category?.slug[this.locale]}`
               // },
               // {
               //    name: this.announcement?.sub_category?.name[this.locale],
               //    route: `/parts/${this.announcement?.category?.slug[this.locale]}?parts_filter={"subcategory":${this.announcement?.sub_category?.id}}`
               // },
               // {
               //    name: this.announcement?.brand?.name,
               //    route: `/parts/${this.announcement?.category?.slug[this.locale]}?parts_filter={"brand_ids":[${this.announcement?.brand?.id}]}`
               // },
               {
                  name: '#' + this.announcement.id_unique
               }
            ]

            return items.filter(item => item.name)
         }
      },
   }
</script>

<style lang="scss" scoped>
   .pages-parts-id {
      .breadcrumbs {
         border: none;
         padding: 20px 0;
      }

      .quickInfoDetails {
         margin-top: 20px;
      }
   }
</style>
