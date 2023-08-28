<template>
   <div :class="colClass || 'stratch-child-block'">
      <div
         v-if="showGallery"
         class="announcements-grid_gallery"
         @click="goToAnnouncement"
      >
         <a
            v-if="clickable && !isMobileBreakpoint && !$env.DEV"
            :href="getLink"
            class="abs-link"
            target="_blank"
            @click.stop
         >
            <span class="sr-only">{{ getAnnouncementTitle(announcement) }}</span>
         </a>

         <div class="d-flex">
            <div>
               <div
                  v-lazy:background-image="$withBaseUrl(announcement.media.thumb[0])"
                  class="item-bg"
                  role="img"
               ></div>
            </div>
            <div>
               <div
                  v-lazy:background-image="$withBaseUrl(announcement.media.thumb[1])"
                  class="item-bg wider"
                  role="img"
               ></div>
               <div
                  v-lazy:background-image="$withBaseUrl(announcement.media.thumb[2])"
                  class="item-bg wider"
                  role="img"
               ></div>
            </div>
         </div>
      </div>

      <div
         :class="['id'+announcement.id,{'overflow-visible isProfilePage': isProfilePage}]"
         class="announcements-grid__item"
         @click="goToAnnouncement"
      >
         <profile-grid-actions
            v-if="isProfilePage && announcement.status !==2"
            :announcement="announcement"
            :class="{'right-aligned-dropdown': isLastChild}"
            :dropdown-id="announcement.id_unique"
            @refreshData="getActiveTabAnnouncements"
         />

         <a
            v-if="clickable && !isMobileBreakpoint && !$env.DEV"
            :href="getLink"
            class="abs-link"
            target="_blank"
            @click.stop
         >
            <!--        <span class="sr-only">{{ getAnnouncementTitle(announcement) }}</span>-->
         </a>

         <div
            v-if="!showGallery"
            v-lazy:background-image="getImage+'&width=308'"
            :aria-label="getAnnouncementTitle(announcement)"
            class="item-bg"
            role="img"
         >
            <div v-if="showOverlay" class="item-overlay">
               <div class="item-overlay__top">
                  <div class="item-overlay__top--left">
                     <div
                        v-if="(announcement.is_auto_salon || announcement.is_external_salon) && !isProfilePage"
                        class="item-overlay__top--left_item"
                     >
                        <template v-if="announcement.is_auto_salon">{{ $t('salon') }}</template>
                        <template v-else-if="announcement.is_external_salon">{{ $t('external_salon') }}</template>
                     </div>

                     <div
                        v-if="isProfilePage"
                        :class="{
                           'activeStatus': announcement.status == 1,
                           'deactiveStatus': announcement.status == 3,
                           'consideration': announcement.status == 2,
                           'rejectedStatus': announcement.status == 0,
                        }"
                        class="item-overlay__top--left_item"
                     >
                        <template v-if="isProfilePage && announcement.status == 0">
                           {{ $t('rejected_many') }}
                        </template>
                        <template v-else-if="isProfilePage && announcement.status == 1">{{ $t('active') }}</template>
                        <template v-else-if="isProfilePage && announcement.status == 2">
                           {{ $t('under_consideration') }}
                        </template>
                        <template v-else-if="isProfilePage && announcement.status == 3">
                           {{ $t('sold') }}
                        </template>
                        <template v-else-if="isProfilePage && announcement.status == 4">
                           {{ $t('timed_out') }}
                        </template>
                     </div>
                  </div>

                  <div
                     :class="{'pending-badge-centered': checkPendingBadge(announcement)}"
                     class="item-overlay__top--right"
                  >
                     <add-favorite
                        v-if="!isProfilePage"
                        :announcement="announcement"
                     />
                     <!--                     <pre>{{announcement}}</pre>-->
                  </div>
               </div>

               <div class="item-overlay__bottom">
                  <div class="item-overlay__bottom--left">
                     <inline-svg
                        v-if="announcement.has_monetization"
                        src="/icons/promote.svg"
                     />
                  </div>

                  <div class="item-overlay__bottom--right">
                     <inline-svg
                        v-if="announcement.show_vin"
                        src="/icons/vin.svg"
                     />

                     <inline-svg
                        v-if="announcement.has_360"
                        src="/icons/360_deg.svg"
                     />
                  </div>

                  <!--                  <add-comparison-->
                  <!--                     :id="announcement.id_unique"-->
                  <!--                     v-if="getType === 'Car'"-->
                  <!--                  />-->
               </div>
            </div>
         </div>

         <div class="item-details">
            <div class="item-details__item d-flex align-items-center justify-content-between">
               <h3>{{ announcement.price }}</h3>

               <div v-if="announcement.tradeable || announcement.credit" class="item-details__icons">
                  <inline-svg
                     v-if="announcement.tradeable"
                     src="/icons/barter.svg"
                  />

                  <inline-svg
                     v-if="announcement.credit"
                     src="/icons/credit.svg"
                  />
               </div>
            </div>

            <div class="item-details__item">
               <template v-if="announcement.brand || announcement.model">
                  {{ announcement.brand }} {{ announcement.model }}
               </template>

               <template v-if="announcement.title">{{ announcement.title }}</template>
            </div>

            <div class="item-details__item">
               <span v-if="announcement.year">{{ announcement.year }} {{ $t('year') }}</span>

               <span v-if="announcement?.car_catalog?.capacity">
                  {{ announcement?.car_catalog?.capacity }} {{ $t('char_litre') }}
               </span>

               <span v-if="announcement.mileage || announcement.mileage_measure">
                  {{ announcement.mileage }}

<!--                  <template v-if="announcement.mileage_measure === 1">-->
                     {{ $t('char_kilometre') }}
<!--                  </template>-->
               </span>

               <span v-if="announcement?.description">{{ announcement?.description }}</span>
            </div>

            <div v-if="!isProfilePage" class="item-details__item">
               {{ announcement.created_at }}
            </div>

            <div v-if="isProfilePage" class="item-details__item d-flex justify-csb">
               <span class="ma-announcement-card__stats">
                                 <inline-svg src="/new-icons/grid/cards/phone.svg"/>
                  <p>{{ announcement.show_phone_number_count || 0 }}</p>

               </span>
               <span class="ma-announcement-card__stats">
                            <inline-svg src="/new-icons/grid/cards/eye.svg"/>
                  <p>{{ announcement.view_count || 0 }}</p>

               </span>
               <span class="ma-announcement-card__stats">
                   <inline-svg src="/new-icons/grid/cards/calendar.svg"/>
                  <p> {{ announcement.created_at }}</p>

               </span>
            </div>
         </div>

         <div v-if="isProfilePage" class="item-monetization">
            <monetization-button
               :announcement="announcement"
               :disabled="announcement.status !== 1"
            />
         </div>
      </div>
   </div>
</template>

<script>
import AddFavorite from '~/components/announcements/AddFavorite'
import AddComparison from '~/components/announcements/AddComparison'
import MonetizationButton from '~/components/announcements/MonetizationButton'
import MonetizationStatsButton from '~/components/announcements/MonetizationStatsButton'
import ProfileGridActions from "~/components/profile/ProfileGridActions";

export default {
   props: {
      announcement: {},
      showStatus: Boolean,
      showMonetizationActions: {
         type: Boolean,
         default: true,
      },
      showCheckbox: Boolean,
      showPhoneCount: Boolean,
      showGallery: Boolean,
      showOverlay: Boolean,
      clickable: Boolean,
      trackViews: Boolean,
      colClass: String,
      isProfilePage: {
         type: Boolean,
         default: false,
      },
      isLastChild: Boolean,
      activeTab: Number,
   },

   components: {
      MonetizationStatsButton,
      MonetizationButton,
      AddFavorite,
      AddComparison,
      ProfileGridActions,
   },

   data() {
      return {
         selected: false
      }
   },

   computed: {
      getType() {
         let item = this.announcement

         if (item.type === "motorcycle") return 'Motorcycle'
         else if (item.type === "scooter") return 'Scooter'
         else if (item.type === "moto_atv") return 'Atv'
         else if (item.commercial_brand) return 'Commercial'
         else if (item.type === "light_vehicle") return 'Car'
         else if (item.type === "part" || item.title) return 'Part'
         return ''
      },

      getLink() {
         let type = 'cars'
         if (['Motorcycle', 'Scooter', 'Atv'].includes(this.getType)) type = 'moto'
         else if (['Commercial'].includes(this.getType)) type = 'commercial'
         else if (['Part'].includes(this.getType)) type = 'parts'
         let path = `/${type}/announcement/${this.announcement.id}`
         return this.$localePath(path)
      },

      getTextLine() {
         if (['Part'].includes(this.getType)) return this.announcement.description
         let text = `${this.announcement.year} ${this.$t('plural_forms_year')[0]}`
         if (
            // this.getCapacity &&
            this.showOverlay
         )
            if (this.getCapacity) {
               text +=
                  // `, ${this.getCapacity}`text +=
                  // `, ${this.announcement.humanize_mileage} ${this.$t('char_kilometre')}`
                  `, ${this.getCapacity}`
            }
         return text
      },

      getImage() {
         let item = this.announcement;
         return this.$withBaseUrl(item.image);

         // if (item.has_360 == false || !item.has_360) {
         //   if (item.media && item.media.thumb && item.media.thumb.length)
         //     return this.$withBaseUrl(item.image)
         //   else if (item.media && item.media.length)
         //     return this.$withBaseUrl(item.media[0].thumb || item.media[0])
         //   return false
         // } else {
         //   return this.$withBaseUrl(item.has_360)
         // }
      },

      getCapacity() {
         let item = this.announcement,
            type = this.getType
         let capacity = item.car_catalog?.capacity || item.capacity
         let showLitres = ['Car', 'Commercial'].includes(type)
         if (!capacity || capacity == '0') return ''
         if (showLitres && capacity > 50) capacity = (capacity / 1000).toFixed(1)
         return `${capacity} ${this.$t(
            showLitres ? 'char_litre' : 'char_sm_cube',
         )}`
      },

      getOdometer() {
         if (this.showOverlay) {
            return `${this.announcement.humanize_mileage} ${this.$t(
               'char_kilometre',
            )}`
         }
      }
   },

   methods: {
      getShineSize(filters) {
         return filters.shine_width.name + '/' + filters.height.name + 'R' + filters.diameter.name
      },

      goToAnnouncement(event) {
         this.$store.commit('closeDropdown');

         if (!this.clickable) return;

         if (this.trackViews) {
            this.fbTrack('ViewContent', {
               content_type: 'product',
               content_category: this.getType,
               content_ids: [this.announcement.id],
               content_name: this.getAnnouncementTitle(this.announcement) + ', ' + this.announcement.year
            })
         }

         if (!this.isMobileBreakpoint && !this.$env.DEV) return;

         if (!this.isMobileBreakpoint) {
            this.$router.push(this.getLink);
         } else if (this.isMobileBreakpoint) {
            event.stopPropagation();
            event.preventDefault();
            this.$router.push(this.getLink);
         }
      },

      handleChange(value) {
         this.selected = value;
         this.$nuxt.$emit('select-announcement', this.announcement.id, value, true);
      },

      selectAnnouncement(id, value, controls = false) {
         if (controls || id != this.announcement.id) return
         this.handleChange(value)
      },

      checkPendingBadge(announcement) {
         if (
            (announcement.status == 2 ||
               announcement.status == 5 ||
               announcement.status == 3) &&
            (announcement.is_auto_salon == true ||
               announcement.is_part_salon == true)
         ) {
            return true
         } else {
            return false
         }
      },

      getActiveTabAnnouncements() {
         this.$store.dispatch('getMyAllAnnouncementsV2', {status: this.activeTab})
      }
   },

   mounted() {
      // console.log('this.announcement', this.announcement)
      this.$nuxt.$on('select-announcement', this.selectAnnouncement)
   },

   beforeDestroy() {
      this.$nuxt.$off('select-announcement', this.selectAnnouncement)
   }
}
</script>

<style lang="scss">

.badge-icon {
   width: 20px;
   margin-right: 3px;
   margin-bottom: 1px;
   height: 20px;
}

.badge-external {
   margin-right: -17px;
   border-bottom-right-radius: 0 !important;
   border-top-right-radius: 0 !important;
}

.shine-size {
   margin-left: auto;
}

.item-overlay__top--left_item {
   &.activeStatus {
      background: #32B878;
   }

   &.deactiveStatus {
      background: #697586;
   }

   &.consideration {
      background: #F79009;
   }

   &.rejectedStatus {
      background: #F97066;
   }
}

.item-monetization {
   position: absolute;
   bottom: 12px;
   left: 12px;
   width: calc(100% - 24px);
   z-index: 2;
   padding: 0 !important;
}

.isProfilePage {
   .item-details {
      padding-bottom: 70px;
      height: auto;
   }
}

.ma-announcement-card__stats {
   display: flex;
   align-items: center;

   p {
      padding-left: 4px;
      margin: 0;
      font: 400 15px/22px 'TTHoves';
   }

   svg {
      height: 28px;
      display: inline !important;
   }
}
</style>
