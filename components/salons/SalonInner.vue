<template>
   <div class="salon-inner">
      <div :class="['profile-card salon-single-card overflow-hidden']">
         <div class="cover-with-avatar position-relative">
             <img
                 :class="['cover-with-avatar__img', {full : !salonSingle?.gallery_thumbs?.length}]"
                 :src="getCover(salonSingle?.cover, salonSingle?.type_id)"
                 alt="img"
             >

            <div
               class="cover-with-avatar__gallery d-none"
               :class="{
                  'big-img' : salonSingle?.gallery_thumbs?.length === 2,
                  'more' : salonSingle?.gallery_thumbs?.length > 6,
               }"
               v-if="salonSingle?.gallery_thumbs?.length"
            >
               <div
                  class="cover-with-avatar__gallery-item"
                  v-for="(item, i) in salonSingle?.gallery_thumbs"
                  :style="{background: `url('${item}') center center / cover no-repeat`}"
                  @click="$nuxt.$emit('show-lightbox', i)"
               />

               <span class="count pointer-events-none" v-if="salonSingle?.gallery_thumbs?.length > 6">
                  + {{ salonSingle?.gallery_thumbs?.length - 6 }} {{ $t('image_small') }}
               </span>
            </div>
         </div>

         <div class="salon-inner__details">
            <div class="salon-inner__details-left">
               <div
                  class="salon-inner__details-logo"
                  :style="`background: url('${getLogo(salonSingle?.logo)}') center center / cover no-repeat`"
               />

               <div class="salon-inner__details-info">
                  <h4 class="salon-inner__details-name">
                     <template v-if="!salonSingle.is_official">
                        {{ $t(isShop ? 'shop' : 'autosalon') }}
                        "{{ salonSingle.name || salonSingle.user.full_name }}"
                     </template>

                     <template v-else>{{ salonSingle.name || salonSingle.user.full_name }}</template>
                  </h4>

                  <h5 class="salon-inner__details-description">{{ salonSingle.description }}</h5>

                  <h5 class="salon-inner__details-address">
                     <icon name="placeholder"/>

                     <a
                        :href="`https://www.google.com/maps?q=${salonSingle.lat}%2C${salonSingle.lng}&ll=${salonSingle.lat}%2C${salonSingle.lng}&z=15`"
                        target="_blank"
                     >
                        {{ salonSingle.address }}
                     </a>
                  </h5>
               </div>
            </div>

            <div class="salon-inner__details-right">
               <div class="d-md-none">
                  <thumbs-gallery where="salon" :media="salonSingle.gallery_thumbs"/>
               </div>

               <div class="salon-inner__details-time">
<!--                  <icon name="time"/>-->
                  <inline-svg src="/icons/clock_new.svg" />

                  <span class="working-time"
                        v-if="salonSingle.working_days && salonSingle.working_hours"
                        v-html="getWorkingDays(salonSingle.working_days, salonSingle.working_hours)"/>

                  <span class="working-time" v-else>
                        {{ $t('everyday') }} : 09:00 - 18:00
                  </span>
               </div>

               <div class="salon-inner__details-tels justify-content-between" v-if="salonSingle.phones && salonSingle.phones.length">
                  <div class="divider d-flex align-items-center">
<!--                     <icon name="phone-call"/>-->
                     <inline-svg src="/icons/phone-2.svg" />

                     <ul>
                        <li v-if="salonSingle?.short_number">
                           <a :href="`tel:${salonSingle?.short_number}`">
                              {{ salonSingle?.short_number }}
                           </a>
                        </li>

                        <li v-for="(item, i) in salonSingle?.phones?.slice(0, 1)" :key="i" v-if="!!salonSingle?.phones?.slice(0, 1).length">
                           <a :href="`tel:${item}`">
                              +{{ normalize(item) }}
                           </a>
                        </li>
                     </ul>
                  </div>

                  <ul v-if="!!salonSingle?.phones?.slice(1, 3).length">
                     <li v-for="(item, i) in salonSingle?.phones?.slice(1, 10)" :key="i">
<!--                     <li v-for="(item, i) in salonSingle?.phones" :key="i" v-if="salonSingle?.phones">-->
                        <a :href="`tel:${item}`">
                           +{{ normalize(item) }}
                        </a>
                     </li>
                  </ul>
               </div>
            </div>
         </div>
      </div>

      <grid
         v-if="shopAnnouncements?.data?.length"
         :announcements="shopAnnouncements?.data"
         :paginate="shopAnnouncements?.meta"
         :pending="pending"
         @pending="pending = true"
         @change-page="changePage"
         escape-duplicates
         :hasContainer="false"
      >
         <template #cap>
            <Cap>
               <template #left>
                  <h3>{{ $t(gridTitle) }}</h3>
               </template>

<!--               <template #right>-->
<!--                  <form-select-->
<!--                     :label="$t('show_by_date')"-->
<!--                     :options="sortItems"-->
<!--                     :clearPlaceholder="true"-->
<!--                     :clear-option="false"-->
<!--                     v-model="sorting"-->
<!--                  />-->
<!--               </template>-->
            </Cap>
         </template>
      </grid>

      <gallery
         v-if="salonSingle.gallery_urls.length"
         where="salon"
         :media="[salonSingle.gallery_urls, salonSingle.gallery_thumbs]"
         :show-slider="false"
         :show-toolbar="false"
      />

<!--      <HandleIds-->
<!--         :items="handleIdsOptions"-->
<!--         :watchIds="false"-->
<!--      />-->
   </div>
</template>

<script>
   import { mapGetters, mapActions } from 'vuex'
   import { SalonsMixin } from '~/mixins/salons'
   import Grid from '~/components/announcements/Grid'
   import Gallery from '~/components/announcements/inner/Gallery'
   import ThumbsGallery from '~/components/announcements/inner/ThumbsGallery'
   import CustomDropdown from "~/components/elements/CustomDropdown.vue";
   import Cap from "~/components/elements/Cap.vue";
   import Relatives from "~/components/announcements/inner/Relatives.vue";
   import HandleIds from "~/components/announcements/HandleIds.vue";

   export default {
      components: {
         Grid,
         Gallery,
         ThumbsGallery,
         CustomDropdown,
         Cap,
         Relatives,
         HandleIds
      },

      mixins: [SalonsMixin],

      data() {
         return {
            pending: false,
            // sorting: 'created_at_desc',
            sortItems: [
               { id: 'created_at_desc', name: this.$t('show_by_date') },
               { id: 'price_asc', name: this.$t('show_cheap_first') },
               { id: 'price_desc', name: this.$t('show_expensive_first') }
            ]
         }
      },

      computed: {
         ...mapGetters(['salonSingle', 'autosalonAnnouncementsId', 'shopAnnouncements']),

         handleIdsOptions() {
            let ids = [];

            ids.push({
               type: 'commercial',
               ids: [...this.shopAnnouncements?.data?.map(item => item.id)]
            });

            return ids;
         },

         hasWorkingHours() {
            return !!this.getWorkingDays(
               this.salonSingle.working_days,
               this.salonSingle.working_hours,
            )
         },

         messengers() {
            let msg = []
            let phonesLength = this.salonSingle.phones?.length || 0
            if (this.salonSingle.whatsapp?.slice(0, phonesLength).find((wp) => wp))
               msg.push('Whatsapp')
            if (this.salonSingle.telegram?.slice(0, phonesLength).find((tg) => tg))
               msg.push('Telegram')
            return msg.join('/')
         },

         isShop() {
            return this.routeName.includes('parts')
         }
      },

      methods: {
         async changePage(page = 1) {
            // console.log('page', page)
            page = this.$route.query.page || 1;
            this.pending = true
            // await this.getSalonById({
            //    slug: this.$route.params.id,
            //    page: page || 1
            // })
            await this.$store.dispatch('fetchAutosalonAnnouncementsId', {id: this.$store.getters.salonSingle.id, page: page});
            this.pending = false;
            this.scrollTo('.cap', [-80, -190])
         },

         scrollFunc() {
            setTimeout(() => {
               this.$scrollTo('.profile_info', 1000);
               // const el = this.$refs.scrollToMe
               // if (el) {
               //   el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
               // }
            }, 1)
         },

         normalize(num) {
            let number = num.toString();
            return number?.substr(0, 3) + ' ' + number?.substr(3, 2) + ' ' + number?.substr(5, 3) + ' ' + number?.substr(8, 2) + ' ' + number?.substr(10, 2);
         },
      },

      props: {
         gridTitle: {
            type: String,
            default: 'auto_salon_ads'
         }
      },

      async fetch() {
         // await this.$store.dispatch('getSalonById', {slug: this.$route.params.id});
         await this.$store.dispatch('getAutoSalonOtherAnnouncements', {id: this.$store?.getters?.salonSingle?.id});
      },

      beforeDestroy() {
         this.$store.commit("mutate", {property: "shopAnnouncements", value: []});
      }
   }
</script>

<style lang="scss">
   .salon-inner {
      &__details {
         display: flex;
         margin-top: 20px;
         width: 100%;
         padding: 24px;
         border-radius: 12px;
         background-color: #FFFFFF;
         gap: 32px;
         overflow: hidden;

         &-left {
            position: relative;
            display: flex;
            max-width: 652px;
            width: 100%;
         }

         &-right {
            max-width: 360px;
            width: 100%;
         }

         &-info {
            width: 100%;
         }

         &-logo {
            width: 100%;
            max-width: 136px;
            height: 136px;
            margin-right: 24px;
            border-radius: 8px;
            overflow: hidden;
         }

         &-name {
            font-weight: 600;
            font-size: 18px;
            line-height: 22px;
            color: #121926;
         }

         &-description {
            height: 72px;
            font-weight: 400;
            font-size: 16px;
            line-height: 24px;
            color: #364152;
            margin: 8px 0 !important;
            overflow: hidden;

            //display: -webkit-box;
            //line-clamp: 3;
            //-webkit-line-clamp: 3;
            //overflow: hidden;
            //-webkit-box-orient: vertical;
         }

         &-address {
            font-weight: 400;
            font-size: 16px;
            line-height: 20px;
            color: #2970FF;

            a {
               margin-left: 7px;
            }
         }

         &-time {
            display: flex;
            align-items: center;
            width: 100%;
            padding: 18px;
            background-color: #EEF2F6;
            border-radius: 12px;

            svg {
               path {
                  &:first-child {
                     fill: #4B5565;
                  }

                  &:last-child {
                     fill: #FFFFFF;
                  }
               }
            }

            span {
               margin-left: 14px;
               font-size: 15px;
               line-height: 18px;
               color: #202939;
            }
         }

         &-tels {
            margin-top: 12px;
            display: flex;
            width: 100%;
            padding: 12px 20px;
            background-color: #EEF2F6;
            border-radius: 12px;

            .divider {
               padding-right: 20px;
               border-right: 1px solid #CDD5DF;
            }

            ul {
               list-style: none;
               margin: 0;
               padding: 0;
               white-space: nowrap;

               li {
                  a {
                     font-weight: 400;
                     font-size: 15px;
                     line-height: 22px;
                     color: #202939;
                  }
               }
            }

            svg {
               min-width: 24px;
               min-height: 24px;
               margin-right: 16px;

               path {
                  fill: #4B5565;
               }
            }
         }

         .inner-thumbs-gallery {
            margin-bottom: 20px;

            .swiper-slide {
               border-radius: 12px;
               overflow: hidden;
            }
         }
      }

      .cap {
         margin: 24px 0;
      }

      .cover-with-avatar {
         &__gallery {
            &.big-img {
               grid-template-columns: repeat(1, 228px) !important;

               .cover-with-avatar__gallery-item {
                  width: 100%;
                  height: 100%;
               }
            }
         }
      }

   }

   .border-padding-none {
      border: none !important;
      padding-bottom: 0 !important;
   }

   .items-total {
      bottom: -5px !important;
      display: flex;
      left: 25px !important;
      font-size: 14px !important;
      font-weight: 500;
   }

   .dark-mode {
      .salon-inner {
         &__details {
            &-tels {
               svg {
                  path {
                     fill: #CDD5DF;
                  }
               }
            }
         }
         table {
            border: none;
            background-color: unset;
         }
      }
   }

   @media (min-width: 992px) {
      .salon-inner {
         .cover-with-avatar {
            &__gallery {
               display: grid !important;
               grid-template-columns: repeat(2, 108px);
               grid-template-rows: repeat(3, 92px);
               gap: 12px;

               &.big-img {
                  grid-template-rows: repeat(2, 143px);
               }
            }
         }
      }
   }

   @media (min-width: 1150px) {
      .salon-inner {
         .cover-with-avatar {
            &__gallery {
               grid-template-rows: repeat(3, 106px);

               &.big-img {
                  grid-template-rows: repeat(2, 166px);
               }
            }
         }
      }
   }
</style>
