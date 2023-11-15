<template>
   <div
       class="quickInfoDetails"
       :class="{'registration-marks' : type === 'plates'}"
   >
      <!--         <h1 class="quick-info__title" v-if="getAnnouncementTitle(announcement)">{{ getAnnouncementTitle(announcement) }}</h1>-->

      <slot name="head" />

      <div class="d-flex align-items-center justify-content-between" v-if="!isMobileBreakpoint">
         <QuickInfoPrice
             :announcement="announcement"
             :type="type"
         />

<!--         <div class="customsDuty">-->
<!--            <p>Təqribi gömrük rüs.</p>-->
<!--            <h4>+4500 AZN</h4>-->
<!--         </div>-->
      </div>

      <ul class="quick-info__details" v-if="!isMobileBreakpoint">
         <li>
            <inline-svg src="/icons/calendar-2.svg" />
            {{ announcement.created_at }}
         </li>

         <li>
            <inline-svg src="/icons/eye-2.svg" />
            {{ announcement.view_count }}
         </li>

         <li>
            <inline-svg src="/icons/favorite_2.svg" />
            {{ announcement.favorites_count }}
         </li>

         <li>
            <inline-svg src="/icons/cursor.svg" />
            {{ announcement.open_count }}
         </li>
      </ul>

      <div class="quick-info__contact">
         <div
             :class="[
                  'quick-info__contact-img',
                  { 'pointer-events-none': contact?.user?.active_announcements_count < 2 },
                  { 'cursor-pointer': contact?.user?.active_announcements_count > 1 },
                  { 'is-online': contact?.user?.is_online }
               ]"
             @click.stop="handleContactClick"
         >
            <img :src="contact.img" alt="user_logo" />
         </div>

         <div class="quick-info__contact-info" @click.stop="handleContactClick">
            <h2
                class="cursor-pointer"
                :class="{ 'pointer-events-none': contact?.user?.active_announcements_count < 2 }"
            >{{ contact.name }}</h2>

            <address v-if="announcement.status !== 3 && getAddress">{{ getAddress }}</address>
            <p class="text-red" v-else-if="announcement.status === 3">{{ $t('sold') }}</p>
            <p class="text-red" v-if="announcement.status === 4">{{ $t('time_is_up') }}</p>

            <nuxt-link
                :to="contact?.link"
                v-if="
                     contact?.user?.active_announcements_count > 1 ||
                     announcement?.is_part_salon ||
                     announcement?.is_auto_salon ||
                     announcement?.is_external_salon
                  "
            >
               <span v-if="announcement?.is_part_salon">{{ $t('go_to_shop') }}</span>

               <span v-else-if="announcement?.is_auto_salon || announcement?.is_external_salon">
                     {{ $t('go_to_salon') }}
                  </span>

               <span v-else>{{ $t('other_announcements_of_user') }}</span>


               <!--                  <icon name="chevron-right" />-->
               <!-- <inline-svg src="/icons/chevron-right.svg" :height="14" /> -->
            </nuxt-link>
         </div>
      </div>

      <div class="row" v-if="announcement?.status != 3">
         <div
             class="col mt-2 mt-lg-3"
             v-if="contact?.lat && contact?.lng"
         >
            <show-map-button :lat="contact?.lat" :lng="contact?.lng" />
         </div>

         <div
             class="mt-2 mt-lg-3"
             :class="contact?.lat && contact?.lng ? 'col-6' : 'col-5'"
             v-if="canSendMessage(announcement) && !isMobileBreakpoint"
         >
            <chat-button :announcement="announcement" has-after-login />
         </div>

         <div
             class="mt-2 mt-lg-3"
             :class="(contact?.lat && contact?.lng) ? 'col-12' : 'col-7'"
             v-if="!isMobileBreakpoint"
         >
            <call-button-multiple
                v-if="announcement?.is_auto_salon"
                :phones="announcement?.user?.auto_salon?.phones"
                :announcement="announcement"
            />

            <call-button
                v-else
                :phone="contact?.phone"
                :announcement-id="announcement?.id_unique"
            />
         </div>

         <div class="col-12 mt-2 mt-lg-3" v-if="announcement?.status === 2">
            <div class="status">{{ $t('announcement_pending') }}</div>
         </div>
      </div>
   </div>
</template>

<script>
   import CallButtonMultiple from "~/components/announcements/CallButtonMultiple.vue";
   import ChatButton from "~/components/announcements/ChatButton.vue";
   import QuickInfoPrice from "~/components/announcements/inner/QuickInfoPrice.vue";
   import CallButton from "~/components/announcements/CallButton.vue";
   import ShowMapButton from "~/components/elements/ShowMapButton.vue";

   export default {
      components: { ShowMapButton, CallButton, QuickInfoPrice, ChatButton, CallButtonMultiple },

      props: {
         announcement: {},
         contact: {},
         type: {
            type: String,
            default: 'cars'
         }
      },

      computed: {
         getAddress() {
            return this.announcement?.is_auto_salon ?
                this.announcement?.user?.auto_salon?.address :
                this.announcement?.is_part_salon ?
                    this.announcement?.user?.part_salon?.address :
                    this.announcement?.address
         }
      }
   }
</script>

<style lang="scss" scoped>
   .quickInfoDetails {
      padding: 24px 20px;
      border-radius: 12px;
      border: 1px solid #CDD5DF;
      overflow: hidden;

      &.registration-marks {
         margin-top: -1px;
         border-radius: 0 0 12px 12px;
      }

      &.btns {
         padding: 0;
         border: none;
      }
   }

   .dark-mode {
      .quickInfoDetails {
         border-color: #1B2434;
         background-color: #1B2434;
      }
   }
</style>
