<template>
   <div class="add_announce">
      <div class="container">
         <h1 class="add_announce_title">{{ $t('new_announce') }}</h1>
         <div class="announce_container">
            <div class="card">
               <div class="add_announce_info">
                  <inline-svg
                     :src="'/icons/stars.svg'"
                     class="add_announce_info_svg"
                  />
                  <p v-html="$t('add_announce_info')"/>
               </div>
               <div class="mobile_info" v-if="Object.values(user).length">
                  <inline-svg
                     :src="'/icons/mobile_2.svg'"
                     class="mobile_info_svg info_svg"
                  />
                  <p v-html="$t('mobile_info', {phone: '+' + user.phone})"/>
               </div>
               <h2 class="card_title">{{ announceTitle }}</h2>
               <div class="card_container">
                  <div class="add_announce_form">
                     <form-select
                        :label="$t('announcement_type')"
                        :options="searchMenus.filter((menu) => menu.id !== 3).map((menu) => ({...menu,name: $t(menu.title)}))"
                        :clear-placeholder="true"
                        :clear-option="false"
                        :new-label="false"
                        object-in-value
                        has-search
                        v-model="form.announce_type"
                        @change="handleAnnounceType"
                     />
                     <car_form v-if="form.announce_type.title === 'cars'" :announcement="announcement"
                               :preview="announcement"
                               :isReady="isReady"
                               @navigationProgress="navigationData.find((nav) => nav.id === $event.id).isActive = $event.status"
                               @getForm="getCarForm($event)" @done="submitShow = $event"/>
                     <moto_form v-if="form.announce_type.title === 'moto'" :announcement="announcement"
                                :preview="announcement"
                                :isReady="isReady"
                                @navigationProgress="navigationData.find((nav) => nav.id === $event.id).isActive = $event.status"
                                @getForm="getMotoForm($event)" @done="submitShow = $event"/>
                     <part_form v-if="form.announce_type.title === 'parts'" :announcement="announcement"
                                :preview="partPreview"
                                @changeType="onChangePartType($event)"
                                @navigationProgress="navigationData.find((nav) => nav.id === $event.id).isActive = $event.status"
                                :isReady="isReady" @getForm="getPartForm($event)" @done="submitShow = $event"/>
                     <registration_mark v-if="form.announce_type.title === 'registration_marks'" :isReady="isReady"
                                        @navigationProgress="navigationData.find((nav) => nav.id === $event.id).isActive = $event.status"
                                        @getForm="getRegistrationMarksForm($event)"/>


                  </div>
                  <div
                     :class="['vehicle_card_info', {default_imgs: announcement.image.startsWith('/img/') || partPreview.image.startsWith('/img/') }]"
                     v-if="!isMobileBreakpoint">
                     <template
                        v-if="form.announce_type.title !== 'registration_marks' && form.announce_type !== '' && (announcement.image || partPreview.image)">
                        <div class="bg-white">
                           <client-only>
                              <grid-item
                                 v-if="form.announce_type.title === 'cars' ||  form.announce_type.title === 'moto' || announcement.image || partPreview.image"
                                 style="pointer-events: none"
                                 :mileage="false"
                                 show-overlay
                                 :hideFavoriteBtn="false"
                                 :announcement="form.announce_type.title === 'parts' ? partPreview : announcement"/>
                           </client-only>
                        </div>
                        <div class="vehicle_card_info_description">
                           <p>{{ $t('announce_looks_like') }}</p>
                        </div>
                        <div class="vehicle_card_info_help">
                           <div class="vehicle_card_info_help_inner">
                              <inline-svg
                                 :src="'/icons/info.svg'"
                              />
                              <p>{{ $t('announce_help_text') }}</p>
                           </div>
                           <button class="btn btn--red" @click="onShowModal('feedback', $t('request2'))">{{
                                 $t("let_us_know")
                              }}
                           </button>
                        </div>
                     </template>
                  </div>
               </div>
               <service-packages
                  v-if="submitShow && (form.announce_type.title === 'cars' || form.announce_type.title === 'moto')"
                  v-model="form.add_monetization" :add_monetization="form.add_monetization"
                  :data="servicePackages"/>
               <template v-if="submitShow">
                  <div class="contacts">
                     <h2>{{ $t("contact_information") }}</h2>
                     <form-text-input
                        :class="{form_error: $v.authForm.name.$error || authError.includes('name')}"
                        v-model="authForm.name"
                        :placeholder="$t('your_name') + '*'"
                        :invalid="$v.authForm.name.$error || authError.includes('name')"
                        :disabled="loggedIn"
                     />
                     <form-text-input
                        :class="{form_error: $v.authForm.email.$error}"
                        v-model="authForm.email"
                        :placeholder="$t('email') + '*'"
                        :mask="$maskEmail()"
                        :invalid="$v.authForm.email.$error || authError.includes('email')"
                     />
                     <form-text-input
                        v-if="!Object.values(user).length"
                        :class="{form_error: $v.authForm.phone.$error || authError.includes('phone')}"
                        key="phone"
                        :placeholder="$t('mobile_phone_number') + '*'"
                        v-model="authForm.phone"
                        :mask="$maskPhone()"
                        :invalid="$v.authForm.phone.$error || authError.includes('phone')"
                     />
                     <form-text-input
                        v-if="authStep === 'handleOTP'"
                        :class="['otp', {form_error: $v.authForm.code.$error}]"
                        :placeholder="$t('OTP') + '*'"
                        v-model="authForm.code"
                        :maxlength="5"
                        :mask="'99999'"
                        :invalid="$v.authForm.code.$error"
                     />
                     <div class="contacts_info" v-if="!Object.values(user).length && authStep !== 'handleOTP'">
                        <inline-svg class="contacts_info_svg info_svg" :src="'/icons/info.svg'"/>
                        <p>{{ $t("contacts_registration_info") }}</p>
                     </div>
                     <div class="resend_section" v-if="authStep === 'handleOTP'">
                        <p :class="{link_active: resendSmsAfterSecond === 0}" @click="resendCode">{{
                              $t('resend_otp')
                           }}</p>
                        <timer
                           v-if="resendSmsAfterSecond > 0"
                           class="otp_timer"
                           :duration="resendSmsAfterSecond"
                           format="i:s"
                           @timeOver="resendSmsAfterSecond = 0"
                        />
                     </div>
                     <button type="button" @click="onClick()"
                             :class="['btn', 'full-width', 'btn--pale-green-outline', 'active', {pending}]">
                        {{ authStep === "notLoggedIn" ? $t("enter_sms_code") : $t("place_announcement") }}
                     </button>
                  </div>
                  <div class="comment_info">
                     <inline-svg
                        :src="'/icons/info.svg'"
                     />
                     <p>{{ $t("by_posting_an_ad_you_confirm_your_agreement_with_the_rules") }}:
                        <nuxt-link :to="`/page/${getRulesPage.slug[locale]}`"
                                   @click.native.prevent="onShowModal('rules', getRulesPage.title[locale])"
                                   event="">
                           <strong style="text-decoration: underline">{{ $t('general_rules') }}</strong>
                        </nuxt-link>
                     </p>
                  </div>
               </template>
            </div>

            <div class="form_navigation" v-if="!isMobileBreakpoint">
               <ul>
                  <li
                     v-for="(nav) in navigationData.filter((nav) => !(nav.id === 3 && form.announce_type.title === 'registration_marks'))"
                     :key="nav.id">
                     <inline-svg :class="['nav_svg', {active: nav.isActive}]" :src="'/icons/filled_circled_check.svg'"/>
                     {{ nav.title }}
                  </li>
               </ul>

            </div>
         </div>
      </div>
      <modal-popup
         :modal-class="modalType === 'monetization_alert' ? 'medium' : 'wider'"
         :toggle="showModal"
         :title="modalTitle"
         @close="showModal = false"
      >

         <div v-if="modalType === 'rules'" v-html="getRulesPage.text[locale]"></div>
         <feedback-modal v-if="modalType === 'feedback'" @close="showModal = false"/>
         <monetization-alert-modal v-if="modalType === 'monetization_alert'" @onSubmit="onSubmitMonetizationModal" @close="showModal = false"/>
      </modal-popup>
   </div>
</template>

<script>
import GridRadio from "~/components/elements/GridRadio.vue";
import ToggleGroup from "~/components/elements/ToggleGroup.vue";
import FormNumericInput from "~/components/forms/FormNumericInput.vue";
import FormRadio from "~/components/forms/FormRadio.vue";
import {MenusDataMixin} from "~/mixins/menus-data";
import ImageComponent from "~/pages/sell/image-component.vue";
import {mapActions, mapGetters} from "vuex";
import PickOnMapButton from "~/components/elements/PickOnMapButton.vue";
import {ToastErrorsMixin} from '~/mixins/toast-errors';
import GridItem from "~/components/announcements/GridItem.vue";
import Car_form from "~/components/sell/car_form.vue";
import Part_form from "~/components/sell/part_form.vue";
import Registration_mark from "~/components/sell/registration_mark.vue";
import Moto_form from "~/components/sell/moto_form.vue";
import {required, email, requiredIf} from "vuelidate/lib/validators";
import {PaymentMixin} from "~/mixins/payment";
import FeedbackModal from "~/components/sell/FeedbackModal.vue";
import ServicePackages from "~/components/sell/ServicePackages.vue";
import MonetizationAlertModal from "~/components/sell/MonetizationAlertModal.vue";

export default {
   name: "add-announce",
   mixins: [MenusDataMixin, ToastErrorsMixin, PaymentMixin],
   components: {
      MonetizationAlertModal,
      ServicePackages,
      FeedbackModal,
      Moto_form,
      Registration_mark,
      Part_form,
      Car_form, GridItem, PickOnMapButton, ImageComponent, GridRadio, ToggleGroup, FormNumericInput, FormRadio
   },
   computed: {
      ...mapGetters(['staticPages', 'servicePackages']),
      getRulesPage() {
         return this.staticPages.find(page => page.id == 1);
      },
   },
   head() {
      return this.$headMeta({
         title: this.$t('meta-title_main-page'),
         description: this.$t('meta-descr_main-page'),
      })
   },
   data() {
      return {
         authError: [],
         alertShowed: false,
         resendSmsAfterSecond: 0,
         pending: false,
         submitShow: false,
         showModal: false,
         modalType: "",
         modalTitle: "",
         isReady: false,
         announceTitle: "",
         navigationData: [
            {
               id: 1, title: this.$t('info_announcement'), isActive: false
            },
            {
               id: 2, title: this.$t('description_announcement'), isActive: false
            },
            {
               id: 3, title: this.$t('images_announcement'), isActive: false
            },
            {
               id: 4, title: this.$t('account_info'), isActive: false
            }
         ],
         partPreview: {
            title: this.$t('headline'),
            description: this.$t('additional_info'),
            image: "",
            price: "0 AZN",
            created_at: this.$moment(new Date()).format('DD.MM.YYYY')
         },
         announcement: {
            image: "",
            show_vin: false,
            has_360: false,
            price: "0 AZN",
            tradeable: false,
            credit: false,
            brand: "Marka",
            model: "Model",
            year: "0000",
            mileage: 0,
            car_catalog: {capacity: "0"},
            created_at: this.$moment(new Date()).format('DD.MM.YYYY')
         },
         form: {
            announce_type: "",
            add_monetization: 1
         },
         authForm: {
            name: "",
            email: "",
            phone: "",
            code: ""
         },
         authStep: "",
         resetAnnouncement: {},
         resetPartPreview: {},
      };
   },
   async asyncData({store}) {
      await store.dispatch('getServicePackages')
   },
   methods: {
      ...mapActions(['carsPost', 'motoPost', 'partsPost', 'plateNumbersPost', 'updatePaidStatus']),
      async handleAnnounceType(payload) {
         if (payload) {
            await this.$store.dispatch(payload.api_key)
         }
      },
      onShowModal(type, title) {
         this.showModal = true
         this.modalType = type
         this.modalTitle = title || ""
      },
      onChangePartType(id) {
         switch (id) {
            case 19:
               return this.partPreview.image = "/img/tyre.svg"
            case 20:
               return this.partPreview.image = "/img/disc.svg"
            case 21:
               return this.partPreview.image = "/img/oil.svg"
            case 27:
               return this.partPreview.image = "/img/battery.svg"
            default:
               return this.partPreview.image = "/img/parts.svg"
         }
      },
      getMainImage(img) {
         let defaultImg = "";
         switch (this.form.announce_type?.id) {
            case 1:
               defaultImg = "/img/car_default.svg"
               break;
            case 4:
               defaultImg = "/img/motorbike.svg"
               break;
            case 20:
               defaultImg = "/img/disc.svg"
               break;
            case 21:
               defaultImg = "/img/oil.svg"
               break;
            case 27:
               defaultImg = "/img/battery.svg"
               break;
            default:
               defaultImg = "/img/parts.svg"
               break;
         }
         if (this.form.announce_type.title === "parts") {
            this.partPreview.image = img || defaultImg
         } else {
            this.announcement.image = img || defaultImg
         }
      },
      async getCarForm({form}) {
         if (this.form.add_monetization === 1 && !this.alertShowed) {
            this.modalType = 'monetization_alert'
            this.modalTitle = ""
            this.alertShowed = true
            this.showModal = true
            return
         }
         this.pending = true;
         try {
            const formData = new FormData()
            formData.append('data', JSON.stringify(form))
            formData.append('add_monetization', this.form.add_monetization)
            const res = await this.carsPost({form: formData, isMobile: this.isMobileBreakpoint});
            this.alertShowed = false
            if (res?.data?.redirect_url) {
               this.handlePayment(res, false, this.$t('car_added'), 'v2')
               !this.isMobileBreakpoint && this.$router.push(this.$localePath('/profile/announcements'))
            } else {
               this.$router.push(this.$localePath('/profile/announcements'), () => {
                  this.updatePaidStatus({
                     type: 'success',
                     text: this.$t('announcement_paid'),
                     title: this.$t('success_payment')
                  });
               });
            }
         } catch (e) {
         } finally {
            this.pending = false;
         }
      },
      async getMotoForm({form}) {
         if (this.form.add_monetization === 1 && !this.alertShowed) {
            this.modalType = 'monetization_alert'
            this.modalTitle = ""
            this.alertShowed = true
            this.showModal = true
            return
         }
         this.pending = true;
         try {
            const formData = new FormData()
            formData.append('data', JSON.stringify(form))
            formData.append('add_monetization', this.form.add_monetization)
            const res = await this.motoPost({form: formData, isMobile: this.isMobileBreakpoint});
            this.alertShowed = false
            if (res?.data?.redirect_url) {
               this.handlePayment(res, false, this.$t('car_added'), 'v2')
               !this.isMobileBreakpoint && this.$router.push(this.$localePath('/profile/announcements'))
            } else {
               this.$router.push(this.$localePath('/profile/announcements'), () => {
                  this.updatePaidStatus({
                     type: 'success',
                     text: this.$t('announcement_paid'),
                     title: this.$t('success_payment')
                  });

               });
            }

         } catch (e) {
         } finally {
            this.pending = false;
         }
      },

      async getRegistrationMarksForm(form) {
         this.pending = true;
         try {
            const res = await this.plateNumbersPost({form, isMobile: this.isMobileBreakpoint});
            if (res?.redirect_url) {
               const response = {data: {...res}}
               this.handlePayment(response, false, this.$t('plate_added'), 'v2')
               !this.isMobileBreakpoint && this.$router.push(this.$localePath('/profile/announcements'))
            } else {
               this.$router.push(this.$localePath('/profile/announcements'), () => {
                  this.updatePaidStatus({
                     type: 'success',
                     text: this.$t('announcement_paid'),
                     title: this.$t('success_payment')
                  });

               });
            }
         } catch (e) {
         } finally {
            this.pending = false;
         }
      },
      async getPartForm({form}) {
         this.pending = true;
         try {
            const formData = new FormData()
            formData.append('data', JSON.stringify(form))
            const res = await this.partsPost(formData);
            if (res?.data?.redirect_url) {
               this.handlePayment(res, false, this.$t('car_added'), 'v2')
               !this.isMobileBreakpoint && this.$router.push(this.$localePath('/profile/announcements'))
            } else {
               this.$router.push(this.$localePath('/profile/announcements'), () => {
                  this.updatePaidStatus({
                     type: 'success',
                     text: this.$t('announcement_paid'),
                     title: this.$t('success_payment')
                  });

               });
            }
            this.$router.push(this.$localePath('/profile/announcements'))
         } catch (e) {
         } finally {
            this.pending = false;
         }
      },
      async resendCode() {
         try {
            await this.$axios
               .$post('/resend/code', {
                  phone: this.authForm.phone.replace(/[^0-9]+/g, ''),
               })

            this.resendSmsAfterSecond = 30;
         } catch (e) {

         }
      },
      onSubmitMonetizationModal() {
         this.showModal = false
         this.isReady = !this.isReady
      },
      onClick() {
         this.$v.authForm.$touch()
         setTimeout(() => {
            this.scrollTo('.form_error', -190)
         });
         if (this.$v.authForm.$error) {
            this.$toasted.error(this.$t('required_fields'));
            return;
         }

         if (this.authStep === "loggedIn") {
            this.isReady = !this.isReady
         } else if (this.authStep === "notLoggedIn") {
            this.onPhoneVerification()
         } else {
            this.onOTPVerification()
         }
      },
      async onPhoneVerification() {
         this.pending = true;
         try {
            const res = await this.$axios
               .$post(this.$env().API_SECRET + '/auth/login-or-register', {phone: this.authForm.phone.replace(/[^0-9]+/g, ''),})

            this.authStep = 'handleOTP'
            this.$nextTick(() => {
               this.scrollTo('.otp', [-50, -190])
            })
            this.resendSmsAfterSecond = 30
            this.$v.authForm.$reset()
         } catch (e) {

         } finally {
            this.pending = false;
         }
      },
      async onOTPVerification() {
         this.pending = true;
         this.authError = []
         try {
            const data = await this.$axios
               .$post(this.$env().API_SECRET + '/auth/confirm-otp', {
                  ...this.authForm,
                  phone: this.authForm.phone.replace(/[^0-9]+/g, '')
               })
            this.fbTrack('Complete Registration Api')
            this.gtagTrack('AW-600951956/-O6CCJGB2fIBEJSZx54C')
            this.$auth.setUser(data.user.original)
            await this.$auth.setUserToken(data.meta.token)
            this.authStep = 'loggedIn'
            this.isReady = !this.isReady
            this.$v.authForm.$reset()
         } catch (e) {
            const errors = []
            for (const key in e.response.data?.data) {
               errors.push(key)
            }
            this.authError = errors
            this.$nextTick(() => {
               this.scrollTo('.form_error', [-50, -190])
            })
         } finally {
            this.pending = false;
         }
      }
   },
   async mounted() {
      this.resetAnnouncement = JSON.parse(JSON.stringify(this.announcement));
      this.resetPartPreview = JSON.parse(JSON.stringify(this.partPreview))
      this.announceTitle = this.$t('place_an_ad')
      if (Object.values(this.user).length) {
         this.authForm.name = this.user.full_name
         this.authForm.email = this.user.email
         this.authForm.phone = this.user.phone
      }
      Object.values(this.user).length ? this.authStep = "loggedIn" : this.authStep = "notLoggedIn"
      this.$nuxt.$on("get-main-image", this.getMainImage)
      await this.$store.dispatch("getOptions")
      await this.$store.dispatch("getColors")
   },
   watch: {
      'form.announce_type'() {
         this.submitShow = false
         this.navigationData.forEach((nav) => nav.id !== 4 && (nav.isActive = false))
         this.partPreview = JSON.parse(JSON.stringify(this.resetPartPreview))
         this.announcement = JSON.parse(JSON.stringify(this.resetAnnouncement));
         switch (this.form.announce_type.title) {
            case "cars":
               this.announceTitle = this.$t('vehicle_info')
               return this.announcement.image = "/img/car_default.svg"
            case "moto":
               this.announceTitle = this.$t('vehicle_info')
               return this.announcement.image = "/img/motorbike.svg"
            case "parts":
               return this.announceTitle = this.$t('part_info')
            case "registration_marks":
               this.announceTitle = this.$t('registration_mark_info')
               return this.submitShow = true
            default:
               this.announceTitle = this.$t('place_an_ad')
         }
      },
      authForm: {
         deep: true,
         handler() {
            const accControl = this.loggedIn ? ['name',
               'email'].every((key) => this.authForm[key]) : ['name',
               'email',
               'phone'].every((key) => this.authForm[key])
            this.navigationData.find((nav) => nav.id === 4).isActive = accControl
         }
      }

   },
   validations: {
      authForm: {
         name: {required},
         email: {
            email, required
         },
         phone: {required},
         code: {
            required: requiredIf(function () {
               return !(this.authStep === "loggedIn" || this.authStep === "notLoggedIn")
            })
         }
      }
   }
};
</script>

<style lang="scss">
.add_announce {
   padding: 40px 0 160px 0;

   &_title {
      font-size: 28px;
      font-weight: 700;
      margin-bottom: 32px;
   }

   .btn {
      height: 52px;
   }

   .announce_container {
      display: flex;
      column-gap: 16px;

      .card {
         width: 100%;
         flex-grow: 3;
         display: flex;
         flex-direction: column;
         gap: 20px;
         padding: 40px;

         &_title {
            font-size: 24px;
            font-weight: 600;
         }

         .add_announce_info {
            display: flex;
            align-items: center;
            padding: 16px;
            gap: 12px;
            background-color: #EEF2F6;
            border-radius: 12px;
            font-size: 14px;
            font-style: normal;
            font-weight: 400;


            &_svg {
               min-width: 32px;
               min-height: 32px;
               color: #155EEF;
            }
         }

         .mobile_info {
            display: flex;
            align-items: center;
            padding: 16px;
            gap: 12px;
            background-color: #ECFDF3;
            border-radius: 12px;
            font-size: 15px;
            font-style: normal;
            font-weight: 500;

            &_svg {
               min-width: 32px;
               min-height: 32px;
               color: #12B76A;
            }

            p {
               color: #12B76A;

               strong {
                  color: #081A3E;
               }
            }
         }

         &_container {
            display: flex;
            gap: 36px;

            .add_announce_form {
               display: flex;
               flex-grow: 1;
               flex-direction: column;
               gap: 20px;
               width: 100%;

               .comment_info {
                  display: flex;
                  align-items: center;
                  gap: 10px;

                  svg {
                     min-width: 24px;
                     min-height: 24px;
                  }
               }

            }

            .vehicle_card_info {
               position: sticky;
               top: 128px;
               display: flex;
               flex-direction: column;
               gap: 16px;
               height: min-content;
               width: 260px;
               min-width: 260px;

               &_description {
                  background-color: #EEF2F6;
                  border-radius: 8px;
                  padding: 10px;
                  text-align: center;
               }

               &_help {
                  display: flex;
                  padding: 16px 12px;
                  flex-direction: column;
                  gap: 16px;
                  border-radius: 12px;
                  border: 1px solid #CDD5DF;
                  background-color: #F8FAFC;

                  &_inner {
                     display: flex;
                     align-items: center;
                     gap: 10px;

                     svg {
                        min-width: 24px;
                        min-height: 24px;
                     }
                  }
               }

               &.default_imgs {

                  .item-bg {
                     background-repeat: no-repeat;
                     background-size: inherit;
                  }
               }
            }

         }

         .contacts {
            display: flex;
            flex-direction: column;
            gap: 16px;
            margin-top: 24px;

            svg {
               min-width: 24px;
               min-height: 24px;
            }

            h2 {
               margin-bottom: 24px;
            }

            &_info {
               display: flex;
               align-items: center;
               gap: 10px;
               padding: 12px 16px;
               background-color: #EEF2F6;
               border-radius: 8px;
            }

            .resend_section {
               display: flex;
               align-items: center;
               justify-content: center;
               gap: 4px;

               .otp_timer {
                  color: #2970FF;
               }

               p {
                  color: #9AA4B2;
                  font-size: 16px;
                  font-weight: 500;

                  &.link_active {
                     color: #2970FF;
                     font-size: 16px;
                     font-weight: 500;
                     text-decoration-line: underline;
                     cursor: pointer;
                  }
               }
            }
         }


      }

      .form_navigation {
         position: sticky;
         top: 188px;
         min-width: 256px;
         max-width: 256px;
         height: min-content;
         flex-grow: 1;

         ul {
            display: flex;
            flex-direction: column;

            li {
               display: flex;
               align-items: center;
               gap: 8px;
               font-size: 16px;
               font-weight: 500;
               padding: 10px 0;

               .nav_svg {
                  min-width: 32px;
                  min-height: 32px;
                  color: #CDD5DF;

                  &.active {
                     color: #12B76A;
                  }
               }
            }

         }
      }

      .divider {
         display: grid;
         grid-template-columns: repeat(2, calc(50% - 8px));
         gap: 16px;

         .mileage_types {
            display: flex;
            gap: 16px;
         }

         .map_btn {
            width: 24px;
            height: 24px;
            color: #155eef;
         }

         .price_types {
            .price_item {
               display: flex;
               align-items: center;
               justify-content: center;
               height: 52px;
               padding: 0 8px;
            }
         }

         .car_number_suffix {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            right: 16px;
         }
      }

      .beaten_suffix {
         position: relative;
         z-index: 1;
         margin-left: auto;
         cursor: progress;
      }

      .comment {
         &_info {
            display: flex;
            align-items: center;
            gap: 10px;
         }
      }
   }
}

.dark-mode {
   .add_announce {
      .btn {
         height: 52px;
      }

      .announce_container {


         .card {
            .add_announce_info {
               background-color: #364152;
            }

            &_container {
               .add_announce_form {
                  .info_svg {
                     color: #4B5565 !important;
                  }

                  .checkbox-input input:checked ~ label {
                     background-color: #121926 !important;

                     .checkbox {
                        background: #121926 !important;
                     }
                  }
               }
            }

            .contacts {

               &_info {
                  background-color: #364152;
               }
            }

            .vehicle_card_info {
               &_description {
                  background-color: #00359E;
               }

               &_help {
                  background-color: #364152;
               }
            }

            .price_types {
               .toggle_item {

                  border-color: #121926;
                  overflow: hidden;

                  &.active {
                     border-color: #155EEF;
                  }

                  .price_item {
                     background-color: #121926;
                     color: #9AA4B2;
                  }
               }
            }
         }

      }
   }
}


@media (max-width: 1150px) {
   .form_navigation {
      display: none;
   }
}

@media (max-width: 485px) {
   .add_announce {
      padding: 24px 0 32px 0;

      &_title {
         font-size: 24px;
         font-weight: 700;
         margin-bottom: 16px;
      }

      .announce_container {
         .divider {

            &.mobile-column {
               display: flex;
               flex-direction: column;
            }
         }

         .card {
            padding: 24px;

            &_title {
               font-size: 20px;
            }
         }
      }
   }
}
</style>
