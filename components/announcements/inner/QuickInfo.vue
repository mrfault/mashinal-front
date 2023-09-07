<template>
   <div :class="['quick-info mb-lg-3', {'registration-marks' : type === 'plates'}]">
      <div class="registration-marks__number" v-if="type === 'plates'">
         <div class="divider">
            <img src="/icons/registrationMarks_icons.svg" alt="icons">
         </div>

         <div class="divider">
            <p>{{ announcement.car_number }}</p>
         </div>

         <span class="registration-marks__number-description">MASHIN.AL</span>
      </div>

      <div
         class="quick-info__item"
         :class="{'registration-marks' : type === 'plates'}"
      >
         <h1 class="quick-info__title" v-if="getAnnouncementTitle(announcement)">{{ getAnnouncementTitle(announcement) }}</h1>

         <div class="d-flex align-items-center justify-content-between">
            <QuickInfoPrice
               :announcement="announcement"
               :type="type"
            />

<!--            <div class="customsDuty">-->
<!--               <p>Təqribi gömrük rüs.</p>-->
<!--               <h4>+4500 AZN</h4>-->
<!--            </div>-->
         </div>

         <ul class="quick-info__details">
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

         <div
            :class="['quick-info__contact', { 'cursor-pointer': !!contact.link }]"
            @click.stop="handleContactClick"
         >
            <div :class="['quick-info__contact-img', { 'is-online': contact?.user?.is_online }]">
               <img :src="contact.img" alt="user_logo"/>
            </div>

            <div class="quick-info__contact-info">
               <h2>{{ contact.name }}</h2>

               <address v-if="announcement.status !== 3 && getAddress">{{ getAddress }}</address>

               <p class="text-red" v-else-if="announcement.status === 3">{{ $t('sold') }}</p>

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
<!--                  <pre>{{announcement.is_auto_salon}} - {{ announcement.is_external_salon }}</pre>-->


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
               v-if="canSendMessage(announcement)"
            >
               <chat-button :announcement="announcement" has-after-login />
            </div>

            <div
               class="mt-2 mt-lg-3"
               :class="(contact?.lat && contact?.lng) ? 'col-12' : 'col-7'"
            >
               <call-button-multiple
                  v-if="announcement?.is_auto_salon"
                  :phones="announcement?.user?.auto_salon?.phones"
                  :announcement-id="announcement?.id_unique"
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

      <ReasonForRejection
         v-if="announcement?.status === 0"
         class="mb-3"
         :options="announcement?.moderator?.reject_reason"
      />

      <div class="wrapp">
         <monetization-button
            v-if="type !== 'plates' && announcement.status === 1"
            class="h-52 mb-3"
            :announcement="announcement"
            @openModal="openModal"
         />

         <div class="btns">
            <add-favorite
               class="h-52"
               :template="'btn'"
               :text="$t('add_favorite')"
               :announcement="announcement"
               v-if="![0,2,3].includes(announcement.status)"
            />

            <add-comparison
               v-if="comparisonExceptions"
               class="h-52"
               :template="'btn'"
               :text="$t('compare')"
               :id="announcement.id_unique"
            />

            <edit-button
               :announcement="announcement"
               :type="type"
               :className="'white h-52'"
               v-if="showEditButton(announcement)"
               @openModal="openModal('isEdit')"
            />
         </div>

         <deactivate-button
            class="mt-3"
            :announcement="announcement"
            v-if="showDeactivateButton(announcement)"
         />

         <restore-button
            :announcement="announcement"
            v-if="userIsOwner(announcement) && announcement.status === 3"
            :free="true"
         />
<!--         v-if="userIsOwner(announcement) && announcement.status === 3 && !announcement.is_external_salon"-->
      </div>

      <VinCode
         class="mt-4"
         :vin="announcement.vin"
         v-if="announcement.vin"
      />

<!--      <InsureCar class="mt-4" />-->

      <modal-popup :toggle="showModal" @close="showModal = false" :title="!isMobileBreakpoint ? $t('sign_in_to_account') : '' ">
<!--         <h2 class="ma-title-sm mb-2" v-if="!isMobileBreakpoint">{{$t('sign_in_to_account')}}</h2>-->
         <login-tabs  loginInModal :class="{'mt-5': isMobileBreakpoint}"></login-tabs>
      </modal-popup>
   </div>
</template>

<script>
   import ReasonForRejection from "~/components/announcements/ReasonForRejection.vue";
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
   import AddComparison from "~/components/announcements/AddComparison.vue";
   import CallButtonMultiple from "~/components/announcements/CallButtonMultiple.vue";
   import QuickInfoPrice from "~/components/announcements/inner/QuickInfoPrice.vue";
   import VinCode from "~/components/elements/VinCode.vue";
   import InsureCar from "~/components/elements/InsureCar.vue";
   import { mapGetters } from 'vuex'

   export default {
      components: {
         ReasonForRejection,
         CallButtonMultiple,
         RestoreButton,
         DeactivateButton,
         EditButton,
         ChatButton,
         CallButton,
         ShowMapButton,
         MonetizationButton,
         MonetizationStatsButton,
         PayAnnouncementButton,
         AddFavorite,
         QuickInfoPrice,
         AddComparison,
         VinCode,
         InsureCar
      },

      data() {
         return {
            showModal: false,
         }
      },

      computed: {
         ...mapGetters(['announcement','loginInEditModal']),

         getAddress() {
            return this.announcement?.is_auto_salon ? this.announcement?.user?.auto_salon?.address : this.announcement?.is_part_salon ? this.announcement?.user?.part_salon?.address : this.announcement?.address
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

         comparisonExceptions() {
            return this.type === 'cars' && ![0,2,3].includes(this.announcement?.status);
         }
      },

      methods: {
         handleContactClick() {
            if (this.contact.link) {
               this.$router.push(this.contact.link)
            }
         },
         showDeactivateButton(item) {
            if (this.$auth.user) {
               if (this.$auth.user.id == item?.user?.id) {
                  if (item?.status == 0 || item?.status == 1) {
                     return true
                  }
               } else {
                  return false
               }
            }
            return false;
         },
         showEditButton(item) {
            // console.log('item.status', item)
            if (this.$auth.loggedIn === false) {
               return item?.status === 1 || item?.status === 2
            } else {
               return this.$auth.user?.id === item?.user?.id && item?.status !== 2 && item?.status !== 3 && item?.status !== 5;
            }
         },
         openModal(actionCase) {
            // console.log('sadsad')
            this.showModal = true
            if (actionCase == 'isEdit'){
               console.log("loginInEditModal",this.loginInEditModal)
               this.$store.commit("mutate", {property: "loginInEditModal", value: true});
               console.log("loginInEditModal",this.loginInEditModal)
            }
         },
         closeModal() {
            this.showModal = false
         },
      },

      created() {
         this.$nuxt.$on('closeModal', () => this.closeModal())
      },

      props: {
         type: String,
         brief: Boolean,
         // item: {
         //    type: Object,
         //    default() { return {} }
         // }
      }
   }
</script>

<style lang="scss">
   .quick-info {
      &__item {
         padding: 24px 20px;
         border-radius: 12px;
         border: 1px solid #CDD5DF;
         margin-bottom: 20px;
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

      &__title {
         font-size: 20px;
         font-weight: 500;
         line-height: 24px;
         text-overflow: ellipsis;
         overflow: hidden;
         white-space: nowrap;
         margin-bottom: 8px;
      }

      .customsDuty {
         padding: 4px 8px;
         border-radius: 8px;
         background-color: #EEF2F6;

         p {
            font-size: 12px;
            font-weight: 400;
            line-height: 14px;
            color: #1B2434;
         }

         h4 {
            font-size: 18px;
            font-weight: 600;
            line-height: 22px;
            color: #1B2434;
         }
      }

      &__details {
         display: flex;
         align-items: center;
         padding: 12px 0 20px 0;
         border-bottom: 1px solid #E3E8EF;

         li {
            display: flex;
            align-items: center;
            gap: 4px;

            &:not(:first-child) {
               margin-left: 12px;
            }
         }
      }

      &__contact {
         display: flex;
         align-items: center;
         margin-top: 20px;

         &-img {
            margin-right: 12px;

            img {
               width: 48px;
               height: 48px;
               border-radius: 50%;
               object-fit: cover;
            }
         }

         &-info {
            h2 {
               font-size: 16px;
               font-weight: 500;
               line-height: 20px;
               color: #121926;
            }

            a {
               font-size: 14px;
               font-weight: 400;
               line-height: 16px;
               text-decoration-line: underline;
               color: #155EEF;
            }
         }
      }

      .btns {
         display: grid;
         grid-template-columns: repeat(2, 1fr);
         gap: 12px;
      }

      //.wrapp {
      //   display: grid;
      //   grid-template-columns: repeat(2, 1fr);
      //   gap: 12px;
      //}

      &.registration-marks {
         .registration-marks__number {
            position: relative;
            //top: 0;
            //left: 0;
            display: flex;
            align-items: center;
            width: 100%;
            padding: 0 11px;
            border-radius: 12px 12px 0 0;
            border: 8px solid #121926;
            border-bottom-width: 22px;

            &-description {
               position: absolute;
               left: 50%;
               bottom: -21px;
               transform: translateX(-50%);
               font-family: 'DinMittelschriftgepraegt', sans-serif;
               width: 100%;
               font-size: 15px;
               line-height: 17px;
               padding: 5px 0;
               text-align: center;
               background-color: #121926;
               color: #FFFFFF;
            }

            .divider {
               &:not(:first-child) {
                  margin: 0 auto;
               }

               img {
                  width: 30px;
               }

               p {
                  font-family: 'DinMittelschriftgepraegt', sans-serif;
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

         .quick-info__details {
            padding: 8px 0;
            border-top: 1px solid #E3E8EF;
         }
      }
   }

   .dark-mode {
      .quick-info {
         &__item {
            border-color: #1B2434;
            background-color: #1B2434;

            //.favorite-btn {
            //   background-color: #121926 !important;
            //}
         }

         &__contact {
            &-info {
               h2 {
                  color: #EEF2F6;
               }
            }
         }

         .status {
            color: #EEF2F6;
         }
      }
   }

   @media (max-width: 500px) {
      .quick-info {
         &__item {
            padding: 16px;
         }

         &__details {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
            margin-top: 10px;
            padding: 8px !important;
            border-radius: 8px;
            border: 1px solid #CDD5DF;

            li {
               justify-content: center;
               position: relative;
               white-space: nowrap;

               &:not(:first-child) {
                  margin-left: 0;
               }

               &:not(:last-child) {
                  margin-left: 0;

                  &:after {
                     content: '';
                     position: absolute;
                     top: 0;
                     right: -12px;
                     width: 1px;
                     height: 100%;
                     background-color: #CDD5DF;
                  }
               }
            }
         }

         .btns {
            grid-template-columns: repeat(1, 1fr);
         }
      }
   }

   @media (max-width: 375px) {
      .quick-info {
         &__details {
            padding: 12px 10px;
            gap: 12px;

            li {
               &:not(:last-child) {
                  &:after {
                     right: -8px;
                  }
               }
            }
         }
      }
   }
</style>
