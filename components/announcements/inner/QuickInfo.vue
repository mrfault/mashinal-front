<template>
   <div :class="['quick-info mb-lg-3', {'registration-marks' : type === 'plates'}]">
      <ReasonForRejection
         class="mb-3"
         v-if="announcement?.moderator?.reject_reason?.length && announcement?.status === 0"
         :options="announcement?.moderator?.reject_reason"
      />

      <div class="registration-marks__number" v-if="type === 'plates'">
         <div class="divider">
            <img src="/icons/registrationMarks_icons.svg" alt="icons">
         </div>

         <div class="divider">
            <p>{{ announcement.car_number }}</p>
         </div>

         <span class="registration-marks__number-description">MASHIN.AL</span>
      </div>

      <QuickInfoDetails
          v-if="!isMobileBreakpoint || type === 'plates'"
          :announcement="announcement"
          :contact="contact"
          :type="type"
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
               class="h-52 d-md-none"
               :template="'btn'"
               :text="$t('add_favorite')"
               :announcement="announcement"
               v-if="![0,2,3,4].includes(announcement.status) && !isMobileBreakpoint"
            />

            <add-comparison
               v-if="comparisonExceptions"
               class="h-52 d-md-none"
               :template="'btn'"
               :text="$t('compare')"
               :id="announcement.id_unique"
            />

            <edit-button
               :announcement="announcement"
               :type="type"
               :className="'white h-52'"
               v-if="showEditButton(announcement) && announcement.status !== 4"
               @openModal="openModal('isEdit')"
            />
         </div>

         <deactivate-button
            class="mt-3"
            :announcement="announcement"
            v-if="showDeactivateButton(announcement) && announcement.status !== 4"
         />

         <restore-button
            :className="'white h-52'"
            :announcement="announcement"
            v-if="announcement.type !== 'plate_number' && restoreCondition"
            @refreshData="$nuxt.refresh()"
            :free="true"
         />
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
   import QuickInfoDetails from "~/components/announcements/inner/QuickInfoDetails.vue";
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
         QuickInfoDetails,
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
            return this.type === 'cars' && ![0,2,3,4].includes(this.announcement?.status);
         },

         restoreCondition() {
            // console.log('tt', this.announcement)
            return (this.announcement.status == 3 || (!(this.announcement.is_auto_salon || this.announcement.is_external_salon) && this.announcement.status == 4))
         }
      },

      methods: {
         handleContactClick() {
            if (this.contact?.user?.active_announcements_count > 1 ||
               this.announcement?.is_part_salon ||
               this.announcement?.is_auto_salon ||
               this.announcement?.is_external_salon) {
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
               this.$store.commit("mutate", {property: "loginInEditModal", value: true});
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
      position: sticky;
      top: 150px;

      .quickInfoDetails {
         margin-bottom: 20px;
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

   @media (max-width: 1150px) {
      .quick-info {
         top: 80px;
      }
   }

   @media (max-width: 500px) {
      .quick-info {
         .quickInfoDetails {
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
