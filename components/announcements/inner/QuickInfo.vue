<template>
   <div :class="['quick-info card mb-lg-3', {'registration-marks' : type === 'registration-marks'}]">
      <div class="registration-marks__number" v-if="type === 'registration-marks'">
         <div class="divider">
            <img src="/icons/registrationMarks_icons.svg" alt="icons">
         </div>

         <div class="divider">
            <p>{{ announcement.car_number }}</p>
         </div>

         <span class="registration-marks__number-description">MASHIN.AL</span>
      </div>

      <h1 v-if="getAnnouncementTitle(announcement)">{{ getAnnouncementTitle(announcement) }}</h1>

      <div class="price">
         <span>{{ announcement.price }}</span>
         <span v-if="type !== 'parts'">
           <icon name="exchange"/>
           {{ announcement.price_converted }}
         </span>
      </div>

      <template v-if="isMobileBreakpoint">
         <div class="more-data d-flex">
            <span class="text-data">№ {{ announcement.id_unique }}</span>
            <span class="text-data">
          <icon name="eye"/>
          {{ announcement.view_count }}
          <icon name="cursor"/>
          {{ announcement.open_count }}
          <icon name="star"/>
          {{ announcement.favorites_count }}
        </span>
            <span class="text-data">
          <icon name="calendar"/>
          {{ announcement.humanize_created_at }}
        </span>
         </div>
         <div class="status" v-if="announcement.status == 2">
            <template v-if="needToPay">
               {{ $t('need_pay') }}
            </template>
            <template v-else>
               {{ $t('announcement_pending') }}
            </template>
         </div>
         <div class="d-flex">
            <share-it type="publish" class="btns"/>
            <button
               class="btn btn--dark-blue-2-outline full-width"
               @click.stop="copyToClipboard($env.WEBSITE_URL + $route.path)"
            >
               <icon name="link"/>
               {{ $t('copy_to_clipboard') }}
            </button>
         </div>
      </template>

      <hr />

      <div
         :class="['contact', { 'cursor-pointer': !!contact.link }]"
         @click.stop="handleContactClick"
      >
         <div :class="['img', { 'is-online': contact.user.is_online }]">
            <img :src="contact.img" alt=""/>
         </div>
         <div class="info">
            <h2>{{ contact.name }}</h2>
            <address v-if="announcement.status != 3">{{ getAddress }}</address>
            <span class="text-red" v-else>{{ $t('sold') }}</span>
            <nuxt-link
               :to="contact.link"
               class="all-announcements text-dark-blue-2 text-medium"
               v-if="
            contact.user.active_announcements_count > 1 ||
            announcement.is_part_salon ||
            announcement.is_autosalon ||
            announcement.is_external_salon
          "
            >
               <span v-if="announcement.is_part_salon">{{ $t('go_to_shop') }}</span>
               <span v-else-if="announcement.is_autosalon || announcement.is_external_salon">
            {{ $t('go_to_salon') }}
          </span>
               <span v-else>{{ $t('other_announcements_of_user') }}</span>
               <icon name="chevron-right"/>
               <!-- <inline-svg src="/icons/chevron-right.svg" :height="14" /> -->
            </nuxt-link>
         </div>
      </div>

      <div class="row" v-if="announcement.status != 3">
         <div class="col mt-2 mt-lg-3" v-if="contact.lat && contact.lng">
            <show-map-button :lat="contact.lat" :lng="contact.lng"/>
         </div>
         <div class="col mt-2 mt-lg-3" v-if="canSendMessage(announcement)">
            <chat-button :announcement="announcement" has-after-login/>
         </div>
         <div class="col-12 mt-2 mt-lg-3" v-if="!isMobileBreakpoint">
            <call-button :phone="contact.phone"/>
         </div>
         <div class="col-12 mt-2 mt-lg-3" v-if="!isMobileBreakpoint && announcement.status === 2">
            <div class="status"> {{ $t('announcement_pending') }}</div>
         </div>
      </div>

      <template v-if="!brief &&((!this.isMobileBreakpoint &&(announcement.status == 1 || announcement.has_monetization)) || needToPay)">
         <hr class="mt-3"
             v-if="needToPay ||
             (!this.isMobileBreakpoint && announcement.has_monetization && $auth.loggedIn) ||
             (!this.isMobileBreakpoint && !announcement.has_monetization) && this.type !== 'registration-marks'"
         />

         <div :class="{ 'mb-2 mb-lg-3': !needToPay }" v-if="type !== 'registration-marks'">
            <pay-announcement-button
               :announcement="announcement"
               v-if="needToPay"
            />
            <monetization-stats-button
               :announcement="announcement"
               v-else-if="!this.isMobileBreakpoint && announcement.has_monetization && $auth.loggedIn && $auth.user.id === announcement.user_id && !needToPay"
            />
            <monetization-button
               class="mt-2"
               :announcement="announcement"
               @openModal="openModal"
            />
         </div>
      </template>

      <template v-if="!brief && announcement.status != 2 && !(announcement.is_autosalon && announcement.status == 3)">
         <hr :class="{ 'mt-3': announcement.status == 3 }"
             v-if="showEditButton(announcement) ||
             showDeactivateButton(announcement) ||
             announcement.status == 3 &&
             !announcement.is_external_salon"
         />

         <div class="row mt-n2 mt-lg-n3">
            <div class="col mt-2 mt-lg-3">
               <restore-button
                  :announcement="announcement"
                  v-if="userIsOwner(announcement) && announcement.status == 3 && !announcement.is_external_salon"
                  :free="true"
               />
               <deactivate-button
                  :announcement="announcement"
                  v-if="showDeactivateButton(announcement)"
               />
            </div>
            <div class="col mt-2 mt-lg-3">
               <edit-button
                  :announcement="announcement"
                  :type="type"
                  v-if="showEditButton(announcement)"
                  @openModal="openModal"
               />
            </div>
         </div>
      </template>
      <modal-popup :toggle="showModal" @close="showModal = false">
         <login-tabs></login-tabs>
      </modal-popup>
   </div>
</template>

<script>
import {mapGetters} from 'vuex'

import RestoreButton from '~/components/announcements/RestoreButton'
import DeactivateButton from '~/components/announcements/DeactivateButton'
import EditButton from '~/components/announcements/EditButton'
import ChatButton from '~/components/announcements/ChatButton'
import CallButton from '~/components/announcements/CallButton'
import MonetizationButton from '~/components/announcements/MonetizationButton'
import MonetizationStatsButton from '~/components/announcements/MonetizationStatsButton'
import PayAnnouncementButton from '~/components/announcements/PayAnnouncementButton'
import ShowMapButton from '~/components/elements/ShowMapButton'
import AddFavorite from "~/components/announcements/AddFavorite.vue";

export default {
   props: {
      type: String,
      brief: Boolean,
   },
   data() {
      return {
         showModal: false,
      }
   },
   components: {
      RestoreButton,
      DeactivateButton,
      EditButton,
      ChatButton,
      CallButton,
      ShowMapButton,
      MonetizationButton,
      MonetizationStatsButton,
      PayAnnouncementButton,
      AddFavorite
   },
   computed: {
      ...mapGetters(['announcement']),
      getAddress() {
         return this.announcement.is_autosalon
            ? this.announcement.user?.autosalon?.address
            : this.announcement.is_part_salon
               ? this.announcement.user?.part_salon?.address
               : this.announcement.address
      },
      contact() {
         return this.getAnnouncementContact(this.announcement)
      },
      needToPay() {
         return (
            this.announcement.status == 2 &&
            this.announcement.system_paid_announce &&
            !this.announcement.system_paid_announce.is_paid
         )
      },
   },
   methods: {
      handleContactClick() {
         if (this.contact.link) {
            this.$router.push(this.contact.link)
         }
      },
      showDeactivateButton(item) {
         if (this.$auth.user.id == item.user.id) {
            if (item.status == 0 || item.status == 1) {
               return true
            }
         } else {
            return false
         }
      },
      showEditButton(item) {
         if (this.$auth.loggedIn == false) {
            return item.status == 1 || item.status == 2
         } else {
            return this.$auth.user.id == item.user.id && item.status != 5 && item.status !== 3;
         }
      },
      openModal() {
         this.showModal = true
      },
      closeModal() {
         this.showModal = false
      },
   },
   created() {
      this.$nuxt.$on('closeModal', () => this.closeModal())
   },
}
</script>

<style lang="scss">
   .quick-info {
      &.registration-marks {
         .registration-marks__number {
            position: absolute;
            top: 0;
            left: 0;
            display: flex;
            align-items: center;
            width: 100%;
            padding: 0 11px;
            border: 7px solid #121926;
            border-bottom-width: 22px;
            margin-bottom: 24px;

            &-description {
               position: absolute;
               left: 50%;
               bottom: -19px;
               transform: translateX(-50%);
               font-family: 'Din', sans-serif;
               font-size: 15px;
               line-height: 17px;
               color: #FFFFFF;
            }

            .divider {
               &:not(:first-child) {
                  margin-left: 15px;
               }

               img {
                  width: 30px;
               }

               p {
                  font-family: 'Din', sans-serif;
                  font-weight: 400;
                  font-size: 56px;
                  line-height: 68px;
                  letter-spacing: -1px;
                  margin: 0;
               }
            }
         }

         .price {
            margin-top: 90px;
         }
      }
   }
</style>
