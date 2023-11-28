<template>
   <div class="add_announce">
      <div class="position-relative container">
         <h1 class="add_announce_title">{{ $t('place_an_ad') }}</h1>
         <div class="announce_container">
            <div class="announce_view">
               <div class="main_card">
                  <div class="main_card_info">
                     <div :class="['add_announce_info', {full: !Object.values(user).length}]">
                        <inline-svg
                           :src="'/icons/stars.svg'"
                           class="add_announce_info_svg"
                        />
                        <p v-html="$t('add_announce_info')"/>
                     </div>
                     <div v-if="Object.values(user).length" class="mobile_info">
                        <inline-svg
                           :src="'/icons/mobile_2.svg'"
                           class="mobile_info_svg info_svg"
                        />
                        <p v-html="$t('mobile_info', {phone: '+' + user.phone})"/>
                     </div>
                  </div>
                  <h2 class="card_title">{{ $t("announcement_type") }}</h2>
                  <toggle-group
                     v-slot="{ item }"
                     :defaultValue="1"
                     :items="searchMenus.filter((menu) => menu.id !== 3).map((menu) => ({...menu,name: $t(menu.label)}))"
                     @change="handleAnnounceType"
                  >
                     <div class="announcement_item">
                        <inline-svg :src="item.icon"/>
                        <p>{{ item.name }}</p>
                     </div>
                  </toggle-group>
               </div>

               <div v-if="form.announce_type !== ''" class="card">
                  <div class="card_container">
                     <div class="add_announce_form">
                        <car_form
                           v-if="form.announce_type.title === 'cars'"
                           :isReady="isReady"
                           :region_id="authForm.region_id"
                           @getForm="getCarForm($event)"
                        />

                        <moto_form
                           v-if="form.announce_type.title === 'moto'"
                           :isReady="isReady"
                           :region_id="authForm.region_id"
                           @getForm="getMotoForm($event)"
                        />

                        <part_form
                           v-if="form.announce_type.title === 'parts'"
                           :isReady="isReady"
                           @getForm="getPartForm($event)"
                        />

                        <registration_mark
                           v-if="form.announce_type.title === 'registration_marks'"
                           :isReady="isReady"
                           @getForm="getRegistrationMarksForm($event)"
                        />
                     </div>
                  </div>

                  <service-packages
                     v-if="form.announce_type.title === 'cars' || form.announce_type.title === 'moto'"
                     v-model="form.add_monetization" :add_monetization="form.add_monetization"
                     :data="servicePackages"/>

                  <template v-if="form.announce_type !== ''">
                     <div class="contacts">
                        <h2>{{ $t("contact_information") }}</h2>

                        <div class="auth_column">
                           <form-text-input
                              v-model="authForm.name"
                              :class="{form_error: $v.authForm.name.$error || authError.includes('name')}"
                              :disabled="loggedIn"
                              :invalid="$v.authForm.name.$error || authError.includes('name')"
                              :placeholder="$t('your_name') + '*'"
                           />
                           <form-text-input
                              key="phone"
                              v-model="authForm.phone"
                              :class="{form_error: $v.authForm.phone.$error || authError.includes('phone')}"
                              :disabled="cantChangePhone"
                              :invalid="$v.authForm.phone.$error || authError.includes('phone')"
                              :mask="$maskPhone()"
                              :placeholder="$t('mobile_phone_number') + '*'"
                           >
                              <template v-if="cantChangePhone" #default>
                                 <button class="change_number btn btn--red-opacity" type="button"
                                         @click="changePhone = true">
                                    {{ $t('change_mobile_number') }}
                                 </button>
                              </template>
                           </form-text-input>

                           <form-text-input
                              v-model="authForm.email"
                              :class="{form_error: $v.authForm.email.$error}"
                              :invalid="$v.authForm.email.$error || authError.includes('email')"
                              :mask="$maskEmail()"
                              :placeholder="$t('email') + '*'"
                           />
                           <form-select
                              v-model="authForm.region_id"
                              :clear-option="false"
                              :clear-placeholder="true"
                              :label="$t('city_of_sale')" :new-label="false"
                              :options="sellOptions.regions"
                              has-search
                           />
                           <form-text-input
                              v-if="authStep === 'handleOTP'"
                              v-model="authForm.code"
                              :class="['otp', {form_error: $v.authForm.code.$error}]"
                              :invalid="$v.authForm.code.$error"
                              :mask="'99999'"
                              :maxlength="5"
                              :placeholder="$t('OTP') + '*'"

                           />
                           <div v-if="authStep === 'handleOTP'" class="resend_section">
                              <p :class="{link_active: resendSmsAfterSecond === 0}" @click="resendCode">
                                 {{ $t('resend_otp') }}
                              </p>

                              <timer
                                 v-if="resendSmsAfterSecond > 0"
                                 :duration="resendSmsAfterSecond"
                                 class="otp_timer"
                                 format="i:s"
                                 @timeOver="resendSmsAfterSecond = 0"
                              />
                           </div>

                           <div class="contacts_info">
                              <inline-svg :src="'/icons/info.svg'" class="contacts_info_svg info_svg"/>
                              <p>{{ $t("contacts_registration_info") }}</p>
                           </div>

                           <div class="submit_button">
<!--                              <div v-if="inLimit"-->
<!--                                   class="limit_error">-->
<!--                                 <p>{{ $t('announce_limit_alert', {price: settingsV2?.settings?.restore_price}) }}</p>-->
<!--                              </div>-->
                              <button :class="['btn', 'full-width', 'btn--pale-green-outline', 'active', {pending}]"
                                      type="button"
                                      @click="onClick()">
                                 {{ authStep === "notLoggedIn" ? $t("enter_sms_code") : $t("place_announcement") }}
                              </button>
                           </div>
                        </div>
                     </div>

                     <div class="comment_info">
                        <inline-svg :src="'/icons/info.svg'" />

                        <p>{{ $t("by_posting_an_ad_you_confirm_your_agreement_with_the_rules") }}:
                           <nuxt-link :to="`/page/${getRulesPage.slug[locale]}`"
                                      event=""
                                      @click.native.prevent="onShowModal('rules', getRulesPage.title[locale])">
                              <strong style="text-decoration: underline">{{ $t('general_rules') }}</strong>
                           </nuxt-link>
                        </p>
                     </div>
                  </template>
               </div>
            </div>

            <div class="baloon">
               <inline-svg src="icons/baloon.svg" @click="onShowModal('feedback', $t('request'))"/>
            </div>
         </div>
      </div>

      <modal-popup
         :modal-class="modalType === 'monetization_alert' ? 'medium' : 'wider'"
         :title="modalTitle"
         :toggle="showModal"
         @close="showModal = false"
      >
         <div v-if="modalType === 'rules'" v-html="getRulesPage.text[locale]"></div>

         <feedback-modal v-if="modalType === 'feedback'" @close="showModal = false" />

         <monetization-alert-modal
            v-if="modalType === 'monetization_alert'"
            :content="
               form.add_monetization === 1 && inLimit ? $t('turbo_n_additional', {
                  turboPrice: settingsV2?.settings?.promotion_price,
                  additionalPrice: settingsV2?.settings?.additional_price,
                  totalPrice: +settingsV2?.settings?.promotion_price + +settingsV2?.settings?.additional_price
               }) : form.add_monetization === 1 ? $t('only_turbo', {
                  price: settingsV2?.settings?.promotion_price
               }) : $t('only_additional', {
                  price: settingsV2?.settings?.additional_price
               })"
            @close="showModal = false"
            @onSubmit="onSubmitMonetizationModal"
         />
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
            showModal: false,
            modalType: "",
            changePhone: false,
            modalTitle: "",
            isReady: false,
            // announcement: {
            //    image: "",
            //    show_vin: false,
            //    has_360: false,
            //    price: "0 AZN",
            //    tradeable: false,
            //    credit: false,
            //    brand: "Marka",
            //    model: "Model",
            //    year: "0000",
            //    mileage: 0,
            //    car_catalog: {capacity: "0"},
            //    created_at: this.$moment(new Date()).format('DD.MM.YYYY')
            // },
            // resetAnnouncement: {},
            // resetPartPreview: {},
            form: {
               announce_type: {
                  id: 1,
                  title: "cars"
               },
               add_monetization: 1
            },
            authForm: {
               name: "",
               email: "",
               phone: "",
               region_id: 1,
               code: ""
            },
            authStep: "",
         };
      },

      methods: {
         ...mapActions(['carsPost', 'motoPost', 'partsPost', 'plateNumbersPost', 'updatePaidStatus']),

         async handleAnnounceType(payload) {
            this.form.announce_type = payload
            if (payload) {
               await this.$store.dispatch(payload.api_key)
            }
         },
         onShowModal(type, title) {
            this.showModal = true
            this.modalType = type
            this.modalTitle = title || ""
         },
         async getCarForm({form}) {
            if ((this.form.add_monetization === 1 || this.user.announce_left_car < 1) && !this.alertShowed) {
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
                  this.handlePayment(res, false, this.$t('car_added'), 'v2', true)
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
            if ((this.form.add_monetization === 1 || this.user.announce_left_moto < 1) && !this.alertShowed) {
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
                  this.handlePayment(response, this.$localePath('/profile/announcements'), this.$t('plate_added'), 'v2');
                  // !this.isMobileBreakpoint && this.$router.push(this.$localePath('/profile/announcements'));
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
               this.$toasted.error(e.response?.data?.message);
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
         async onClick() {
            try {
              this.$v.authForm.$touch();
              setTimeout(() => {
                this.scrollTo('.form_error', -190)
              });

              if (this.$v.authForm.$error) {
                this.$toasted.error(this.$t('required_fields'));
                return;
              }

              if (this.authStep === "loggedIn") {
                let phone = this.authForm.phone.replace(/[^0-9]+/g, '');
                if (phone.length < 10) phone = `994${phone}`;

                const res = await this.$axios.$post(this.$env().API_SECRET + '/auth/update/before-publish',
                    { phone: phone, email: this.authForm.email } );

                if (res.message === 'success') this.isReady = !this.isReady;
              } else if (this.authStep === "notLoggedIn") {
                await this.onPhoneVerification();
              } else {
                await this.onOTPVerification();
              }
            } catch (e) {
              console.log(e)
            }
         },
         async onPhoneVerification() {
            this.pending = true;
            try {
               await this.$axios.$post(this.$env().API_SECRET + '/auth/login-or-register', {
                 phone: this.authForm.phone.replace(/[^0-9]+/g, '')
               });

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

      computed: {
         ...mapGetters(['staticPages', 'servicePackages', 'settingsV2', 'sellOptions']),

         getRulesPage() {
            return this.staticPages.find(page => page.id == 1);
         },
         cantChangePhone() {
            return !!Object.keys(this.user).length && !this.changePhone
         },
         inLimit() {
            return (this.form.announce_type?.id === 1 && this.user.announce_left_car < 1) || (this.form.announce_type?.id === 4 && this.user.announce_left_moto < 1)
         }
      },

      async asyncData({ store }) {
         await Promise.all([
            store.dispatch('getServicePackages'),
            store.dispatch('getSettingsV2'),
            store.dispatch('getBrands'),
            store.dispatch('getAllOtherOptions', '2')
         ]);
      },

      async mounted() {
         if (Object.values(this.user).length) {
            this.authForm.name = this.user.full_name
            this.authForm.email = this.user.email
            this.authForm.phone = this.user.phone.toString().slice(3)
         }
         Object.values(this.user).length ? this.authStep = "loggedIn" : this.authStep = "notLoggedIn"
         await this.$store.dispatch("getOptions")
         await this.$store.dispatch("getColors")
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
      padding: 24px 0 160px 0;

      input:checked ~ label {
         background-color: #EFF4FF;
      }

      .other_parameters__checkbox, .vin {
         input:checked ~ label {
            background-color: inherit;
         }
      }

      .divider {
         display: grid;
         grid-template-columns: repeat(2, calc(50% - 8px));
         gap: 16px;
      }

      .divider_3 {
         display: grid;
         grid-template-columns: repeat(3, calc(33% - 8px));
         gap: 16px;
      }

      &_title {
         font-size: 22px;
         font-weight: 700;
         margin-bottom: 24px;
      }

      .btn {
         height: 52px;
      }

      .announce_container {
         position: relative;

         .announce_view {
            display: flex;
            flex-direction: column;
            gap: 24px;

            .main_card {
               display: flex;
               flex-direction: column;
               gap: 20px;
               padding: 24px;
               border-radius: 16px;
               background: #FFF;

               .card_title {
                  font-size: 20px;
                  font-weight: 600;
                  margin-top: 4px;
               }

               &_info {
                  display: flex;
                  gap: 20px;

                  .add_announce_info {
                     width: 50%;
                     display: flex;
                     align-items: center;
                     padding: 16px;
                     gap: 12px;
                     background-color: #EEF2F6;
                     border-radius: 12px;
                     font-size: 14px;
                     font-style: normal;
                     font-weight: 400;

                     &.full {
                        width: 100%;
                     }


                     &_svg {
                        min-width: 32px;
                        min-height: 32px;
                        color: #155EEF;
                     }
                  }

                  .mobile_info {
                     width: 50%;
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
               }

               .toggle_item {
                  overflow: hidden;

                  .announcement_item {
                     display: flex;
                     align-items: center;
                     gap: 8px;
                     height: 52px;
                     padding: 4px 16px;
                  }

                  &.active {
                     .announcement_item {
                        background-color: #EFF4FF;

                        svg {
                           color: #155eef;
                        }
                     }
                  }
               }
            }

            .card {
               width: 100%;
               flex-grow: 3;
               display: flex;
               flex-direction: column;
               gap: 20px;


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
                     margin-bottom: 4px;
                  }

                  .auth_column {
                     display: flex;
                     flex-wrap: wrap;
                     gap: 16px;

                     & > * {
                        width: calc(50% - 8px);
                     }

                     .change_number {
                        position: absolute;
                        top: 50%;
                        right: 9px;
                        transform: translateY(-50%);
                        height: 34px;
                        padding: 8px;
                        border-radius: 8px;
                        background: #F81734;
                        font-size: 15px;
                        font-weight: 500;
                        color: white;
                     }

                     .contacts_info {
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        padding: 10px 16px;
                        height: 52px;
                        background-color: #EEF2F6;
                        border-radius: 8px;
                        font-size: 14px;
                        font-weight: 400;
                        line-height: 16px;
                     }
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

                  .submit_button {
                     display: flex;
                     flex-direction: column;
                     gap: 16px;

                     //.limit_error {
                     //   display: flex;
                     //   align-items: center;
                     //   padding: 16px;
                     //   gap: 12px;
                     //   border: 1px solid #F81734;
                     //   background-color: #FEF3F2;
                     //   color: #F81734;
                     //   border-radius: 12px;
                     //   font-size: 13px;
                     //   font-weight: 500;
                     //}
                  }
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

         .baloon {
            height: 100%;
            position: sticky;
            width: min-content;
            margin-left: auto;
            bottom: 0;
            transform: translate(55px, -70px);

            svg {
               cursor: pointer;
            }
         }
      }
   }

   .car_identification {
      padding: 14px 16px;
      align-items: center;
      gap: 8px;
      border-radius: 8px;
      border: 1px solid #155EEF;
      //height: -webkit-fill-available;
      //height: -moz-available;
      //height: fill-available;

      .car_number_form {
         width: 100%;

         .registrationMarks {
            margin-bottom: 20px;

            p {
               font-size: 16px;
               font-weight: 500;
            }

            &__number {
               position: relative;
               border: 7px solid #121926;
               background-color: #121926;
               border-bottom-width: 14px;
               border-radius: 8px 8px 0 0;

               &-inner {
                  border-radius: 5px;
                  padding: 0 6px;
                  background-color: #FFFFFF;
                  display: flex;
                  align-items: center;
               }

               &-description {
                  position: absolute;
                  left: 50%;
                  bottom: -12px;
                  transform: translateX(-50%);
                  font-family: 'DinMittelschriftgepraegt', sans-serif;
                  font-size: 8px;
                  line-height: 9px;
                  color: #FFFFFF;
               }

               input {
                  text-align: center;
                  border: unset;
                  font-size: 25px;
                  font-weight: 700;
                  line-height: 40.855px;
                  padding: 6px;
                  background-color: #fff !important;
               }
            }
         }

         .vin {
            p {
               font-size: 16px;
               font-weight: 500;
            }

            .checkbox-input label {
               border: unset;
               padding: unset;
            }
         }

      }

      .car_number_info {
         display: flex !important;
         flex-direction: column;
         height: max-content;
         padding: 14px 16px;
         justify-content: center;
         align-items: center;
         gap: 24px;
         border-radius: 8px;
         border: 1px solid #CDD5DF;
         font-size: 12px;
         font-weight: 400;

         strong {
            font-weight: 500;
            text-decoration-line: underline;
         }
      }
   }

   .dark-mode {
      .add_announce {
         .btn {
            height: 52px;
         }


         .announce_container {
            .announce_view {
               .main_card {
                  background-color: #1B2434;

                  .toggle_item.active {
                     .announcement_item {
                        background-color: #121926;
                     }
                  }

                  .main_card_info {
                     .add_announce_info {
                        background-color: #121926;
                     }
                  }
               }
            }

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

                     .other_parameters__checkbox, .vin {
                        input ~ label, input:checked ~ label {
                           background-color: transparent !important;
                        }
                     }
                  }
               }

               .contacts {

                  &_info {
                     background-color: #121926 !important;
                  }
               }
            }
         }

      }

      .baloon {
         svg {
            path:last-of-type {
               fill: #000;

            }
         }
      }
   }

   @media (max-width: 1150px) {
      .mobile-column {
         display: flex;
         flex-direction: column;
      }
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

               &_title {
                  font-size: 20px;
               }
            }
         }
      }
      .main_card {
         &_info {
            flex-direction: column;

            .add_announce_info, .mobile_info {
               width: 100% !important;
            }
         }

         .toggle_container {
            display: grid !important;
            grid-template-columns: repeat(2, 1fr);

         }
      }
      .contacts {
         .auth_column {
            flex-wrap: nowrap;
            flex-direction: column;

            & > * {
               width: 100% !important;
            }

            button {
               order: 2;
            }
         }
      }
   }
</style>
